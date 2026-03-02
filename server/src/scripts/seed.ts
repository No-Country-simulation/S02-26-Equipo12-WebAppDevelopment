import 'reflect-metadata';
import { sequelize } from '../config/db.config';
import {
  Brand,
  Category,
  CategoryRequirement,
  MeasurementType,
  Product,
  ProductSizeRange,
  SubCategory,
} from '../models';
import {
  fetchCollectionProducts,
  fetchProductVariantsByHandle,
  getCollectionIdFromUrl,
} from '../seed/crawler';
import { loadSeedTargetsFromClientMenu } from '../seed/menuLoader';
import { normalizeProduct } from '../seed/normalize';

type SeedCounters = {
  categoriesCreated: number;
  subCategoriesCreated: number;
  brandsCreated: number;
  productsCreated: number;
  productsUpdated: number;
  rangesInserted: number;
  skipped: number;
  errors: number;
};

type TargetCounters = {
  key: string;
  categoryName: string;
  subCategoryName: string;
  productsCreated: number;
  productsUpdated: number;
  rangesInserted: number;
  skipped: number;
  errors: number;
};

type EntityRef = {
  id: string;
  created: boolean;
};

const counters: SeedCounters = {
  categoriesCreated: 0,
  subCategoriesCreated: 0,
  brandsCreated: 0,
  productsCreated: 0,
  productsUpdated: 0,
  rangesInserted: 0,
  skipped: 0,
  errors: 0,
};

const perTargetCounters = new Map<string, TargetCounters>();

const dryRun = process.env.SEED_DRY_RUN === '1';

const getTargetCounter = (
  categoryName: string,
  subCategoryName: string,
): TargetCounters => {
  const key = `${categoryName} > ${subCategoryName}`;
  const existing = perTargetCounters.get(key);
  if (existing) {
    return existing;
  }

  const created: TargetCounters = {
    key,
    categoryName,
    subCategoryName,
    productsCreated: 0,
    productsUpdated: 0,
    rangesInserted: 0,
    skipped: 0,
    errors: 0,
  };

  perTargetCounters.set(key, created);
  return created;
};

const getOrCreateSizeIndexMeasurementType = async (): Promise<MeasurementType> => {
  if (dryRun) {
    const existing = await MeasurementType.findOne({
      where: { code: 'size_index' },
    });

    if (existing) {
      return existing;
    }

    return {
      id: 'dry-run-size-index',
      code: 'size_index',
    } as MeasurementType;
  }

  const [measurementType, created] = await MeasurementType.findOrCreate({
    where: { code: 'size_index' },
    defaults: {
      code: 'size_index',
      unit: 'index',
      appliesTo: 'other',
      description: 'Indice ordinal de tallas textuales (S, M, L, etc.) para seed inicial',
    },
  });

  if (created) {
    console.log('Measurement type creado: size_index');
  }

  return measurementType;
};

const upsertCategoryRequirement = async (
  subCategoryId: string,
  measurementTypeId: string,
): Promise<void> => {
  if (dryRun) {
    return;
  }

  await CategoryRequirement.findOrCreate({
    where: {
      subCategoryId,
      measurementTypeId,
    },
    defaults: {
      subCategoryId,
      measurementTypeId,
    },
  });
};

const upsertProductSizeRanges = async (
  productId: string,
  measurementTypeId: string,
  ranges: Array<{ sizeLabel: string; minValue: number; maxValue: number }>,
): Promise<number> => {
  if (dryRun) {
    return ranges.length;
  }

  await ProductSizeRange.destroy({
    where: {
      productId,
      measurementTypeId,
    },
  });

  if (!ranges.length) {
    return 0;
  }

  const payload = ranges.map((range) => ({
    productId,
    measurementTypeId,
    sizeLabel: range.sizeLabel,
    minValue: range.minValue,
    maxValue: range.maxValue,
  }));

  await ProductSizeRange.bulkCreate(payload);
  return payload.length;
};

const resolveCategory = async (categoryName: string): Promise<EntityRef> => {
  if (dryRun) {
    const existing = await Category.findOne({ where: { name: categoryName } });
    if (existing) {
      return { id: existing.id, created: false };
    }

    return { id: `dry-category-${categoryName.toLowerCase()}`, created: true };
  }

  const [category, created] = await Category.findOrCreate({
    where: { name: categoryName },
    defaults: { name: categoryName },
  });

  return { id: category.id, created };
};

const resolveSubCategory = async (
  categoryId: string,
  subCategoryName: string,
): Promise<EntityRef> => {
  if (dryRun) {
    const existing = await SubCategory.findOne({
      where: {
        name: subCategoryName,
        categoryId,
      },
    });

    if (existing) {
      return { id: existing.id, created: false };
    }

    return {
      id: `dry-subcategory-${categoryId}-${subCategoryName.toLowerCase()}`,
      created: true,
    };
  }

  const [subCategory, created] = await SubCategory.findOrCreate({
    where: {
      name: subCategoryName,
      categoryId,
    },
    defaults: {
      name: subCategoryName,
      categoryId,
    },
  });

  return { id: subCategory.id, created };
};

const resolveBrand = async (brandName: string): Promise<EntityRef> => {
  if (dryRun) {
    const existing = await Brand.findOne({ where: { name: brandName } });
    if (existing) {
      return { id: existing.id, created: false };
    }

    return { id: `dry-brand-${brandName.toLowerCase()}`, created: true };
  }

  const [brand, created] = await Brand.findOrCreate({
    where: { name: brandName },
    defaults: { name: brandName },
  });

  return { id: brand.id, created };
};

const processTarget = async (
  target: { categoryName: string; subCategoryName: string; url: string },
  measurementTypeId: string,
  maxPagesPerTarget: number,
): Promise<void> => {
  const targetCounter = getTargetCounter(target.categoryName, target.subCategoryName);

  const category = await resolveCategory(target.categoryName);

  if (category.created) {
    counters.categoriesCreated += 1;
  }

  const subCategory = await resolveSubCategory(category.id, target.subCategoryName);

  if (subCategory.created) {
    counters.subCategoriesCreated += 1;
  }

  await upsertCategoryRequirement(subCategory.id, measurementTypeId);

  const collectionId = await getCollectionIdFromUrl(target.url);
  if (!collectionId) {
    console.warn(`Sin collectionId para ${target.url}`);
    counters.skipped += 1;
    targetCounter.skipped += 1;
    return;
  }

  let page = 0;
  while (true) {
    if (maxPagesPerTarget > 0 && page >= maxPagesPerTarget) {
      break;
    }

    const listProducts = await fetchCollectionProducts(collectionId, page);
    if (!listProducts.length) {
      break;
    }

    for (const productHit of listProducts) {
      try {
        const variants = await fetchProductVariantsByHandle(productHit.handle);
        const normalized = normalizeProduct(productHit, variants.length ? variants : [productHit]);
        if (!normalized) {
          counters.skipped += 1;
          targetCounter.skipped += 1;
          continue;
        }

        const brand = await resolveBrand(normalized.brand);

        if (brand.created) {
          counters.brandsCreated += 1;
        }

        const existingProduct = await Product.findOne({
          where: {
            name: normalized.name,
            brandId: brand.id,
            subCategoryId: subCategory.id,
          },
        });

        let productId: string;
        if (existingProduct) {
          productId = existingProduct.id;
          if (!dryRun) {
            await existingProduct.update({
              description: normalized.description,
              price: normalized.price,
              stock: normalized.stock,
            });
          }
          counters.productsUpdated += 1;
          targetCounter.productsUpdated += 1;
        } else {
          if (dryRun) {
            productId = `dry-product-${brand.id}-${subCategory.id}-${normalized.name.toLowerCase()}`;
          } else {
            const product = await Product.create({
              name: normalized.name,
              description: normalized.description,
              price: normalized.price,
              stock: normalized.stock,
              brandId: brand.id,
              subCategoryId: subCategory.id,
            });
            productId = product.id;
          }

          counters.productsCreated += 1;
          targetCounter.productsCreated += 1;
        }

        const insertedRanges = await upsertProductSizeRanges(
          productId,
          measurementTypeId,
          normalized.sizeRanges,
        );
        counters.rangesInserted += insertedRanges;
        targetCounter.rangesInserted += insertedRanges;
      } catch (error) {
        counters.errors += 1;
        targetCounter.errors += 1;
        console.error(`Error al procesar producto ${productHit.handle}:`, error);
      }
    }

    page += 1;
  }
};

const seed = async (): Promise<void> => {
  console.log(`Iniciando seed${dryRun ? ' (dry-run)' : ''}...`);
  sequelize.options.logging = false;

  const maxTargets = Number(process.env.SEED_LIMIT_TARGETS ?? 0);
  const maxPagesPerTarget = Number(process.env.SEED_MAX_PAGES ?? 0);

  await sequelize.sync({ alter: true });

  const targets = loadSeedTargetsFromClientMenu();
  const uniqueTargets = Array.from(
    new Map(targets.map((target) => [`${target.categoryName}|${target.subCategoryName}|${target.url}`, target])).values(),
  );

  const measurementType = await getOrCreateSizeIndexMeasurementType();

  const finalTargets = maxTargets > 0
    ? uniqueTargets.slice(0, maxTargets)
    : uniqueTargets;

  for (const target of finalTargets) {
    console.log(`Procesando ${target.categoryName} > ${target.subCategoryName}`);
    await processTarget(target, measurementType.id, maxPagesPerTarget);
  }

  console.log('Seed finalizado');
  console.table(counters);

  const targetSummary = Array.from(perTargetCounters.values()).map((item) => ({
    target: item.key,
    created: item.productsCreated,
    updated: item.productsUpdated,
    ranges: item.rangesInserted,
    skipped: item.skipped,
    errors: item.errors,
  }));

  if (targetSummary.length) {
    console.log('Resumen por categoria/subcategoria:');
    console.table(targetSummary);
  }
};

seed()
  .catch((error) => {
    console.error('Seed falló:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
