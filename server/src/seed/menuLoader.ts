import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

type RawMenuCategory = {
  name: string;
  url: string;
  subcategories: Array<{ name: string; url: string }>;
};

export type SeedTarget = {
  categoryName: string;
  subCategoryName: string;
  url: string;
};

const executeCategoryFile = (
  filePath: string,
  exportName: string,
): RawMenuCategory[] => {
  const code = fs.readFileSync(filePath, 'utf-8');
  const transformed = code.replace(
    `export const ${exportName} =`,
    `const ${exportName} =`,
  );

  const context = {
    module: { exports: {} as Record<string, unknown> },
    exports: {} as Record<string, unknown>,
  };

  const script = new vm.Script(
    `${transformed}\nmodule.exports = { ${exportName} };`,
    {
      filename: filePath,
    },
  );

  script.runInNewContext(context);

  const result = context.module.exports[exportName];
  if (!Array.isArray(result)) {
    throw new Error(`No se pudo cargar ${exportName} desde ${filePath}`);
  }

  return result as RawMenuCategory[];
};

export const loadSeedTargetsFromClientMenu = (): SeedTarget[] => {
  const riderPath = path.resolve(__dirname, '../../../client/src/utils/rider.ts');
  const horsePath = path.resolve(__dirname, '../../../client/src/utils/horse.ts');

  const riderCategories = executeCategoryFile(riderPath, 'riderCategories');
  const horseCategories = executeCategoryFile(horsePath, 'horseCategories');

  const all = [...riderCategories, ...horseCategories];
  const targets: SeedTarget[] = [];

  for (const category of all) {
    targets.push({
      categoryName: category.name.trim(),
      subCategoryName: category.name.trim(),
      url: category.url.trim(),
    });

    for (const subcategory of category.subcategories) {
      targets.push({
        categoryName: category.name.trim(),
        subCategoryName: subcategory.name.trim(),
        url: subcategory.url.trim(),
      });
    }
  }

  return targets.filter((target) => Boolean(target.categoryName && target.subCategoryName && target.url));
};
