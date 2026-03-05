import { calculateBestSizes } from "./recommendation.engine";
import { EngineResult, EngineInput, GroupedSize } from "./recommendation.engine";
import { ProductSizeRange, MeasurementType } from "../models";
import { RiderMeasurement } from "../models/riderMeasurement";
import { HorseMeasurement } from "../models/horseMeasurement";
//import { Product } from "../models/productModel";
//import { CategoryRequirement } from "../models/categoryRequirement"

export class RecommendationService {

  async getRecommendations(
    riderId: string,
    horseId: string,
    productId: string
  ): Promise<EngineResult> {

    // 1️ Obtener medidas requeridas por producto
    const requiredMeasurementTypes = await this.getRequiredMeasurementTypes(productId);

    // 2️ Obtener medidas del rider y horse
    const measurements = await this.getMeasurementsForProduct(
      riderId,
      horseId,
      requiredMeasurementTypes
    );

    // 3️ Obtener tallas agrupadas con sus rangos
    const groupedSizes = await this.getGroupedSizes(productId);

    // 4️ Construir input del engine
    console.log("requiredMeasurementTypes", requiredMeasurementTypes);
    console.log("measurements", measurements);
    const input: EngineInput = {
      measurements,
      requiredMeasurementTypes,
      groupedSizes
    };

    // 5️ Ejecutar motor
    return calculateBestSizes(input);
  }

  // -----------------------
  // Métodos auxiliares
  // -----------------------

  private async getMeasurementsForProduct(
    riderId: string,
    horseId: string,
    requiredMeasurementTypes: string[]
  ): Promise<Record<string, number>> {

    if (requiredMeasurementTypes.length === 0) return {};

    // Buscar los MeasurementType necesarios
    const measurementTypes = await MeasurementType.findAll({
      where: { code: requiredMeasurementTypes }
    });

    const riderTypeIds: string[] = [];
    const horseTypeIds: string[] = [];

    for (const type of measurementTypes) {
      if (type.appliesTo === 'rider') riderTypeIds.push(type.id);
      if (type.appliesTo === 'horse') horseTypeIds.push(type.id);
    }

    // Buscar medidas del rider
    const riderMeasurements = riderTypeIds.length > 0
      ? await RiderMeasurement.findAll({
        where: { riderId, measurementTypeId: riderTypeIds }
      })
      : [];

    // Buscar medidas del horse
    const horseMeasurements = horseTypeIds.length > 0
      ? await HorseMeasurement.findAll({
        where: { horseId, measurementTypeId: horseTypeIds }
      })
      : [];

    // Construir objeto final por code
    const result: Record<string, number> = {};

    for (const rm of riderMeasurements) {
      const type = measurementTypes.find(t => t.id === rm.measurementTypeId);
      if (type) result[type.code] = Number(rm.value);
    }

    for (const hm of horseMeasurements) {
      const type = measurementTypes.find(t => t.id === hm.measurementTypeId);
      if (type) result[type.code] = Number(hm.value);
    }

    return result;
  }

  /*private async getRequiredMeasurementTypes(_productId: string): Promise<string[]> {

    const product = await Product.findByPk(_productId);

    if (!product) throw new Error('Product not found');
 
    
    const requirements = await CategoryRequirement.findAll({
      where: { subCategoryId: product.subCategoryId },
      include: [{
        model: MeasurementType,
        attributes: ['code']
      }]
    });

    

    return requirements.map(r => r.measurementType.code);
  }
*/

private async getRequiredMeasurementTypes(productId: string): Promise<string[]> {

  const ranges = await ProductSizeRange.findAll({
    where: { productId },
    include: [{ model: MeasurementType, attributes: ['code'] }]
  });

  const codes = ranges.map(r => r.measurementType.code);

  return [...new Set(codes)];
}

  private async getGroupedSizes(_productId: string): Promise<GroupedSize[]> {

    const ranges = await ProductSizeRange.findAll({
      where: { productId: _productId },
      include: [{ model: MeasurementType, attributes: ['code'] }]
    });

    // Objeto temporal para agrupar por sizeLabel
    const groupedMap: Record<string, GroupedSize> = {};

    for (const range of ranges) {
      const sizeLabel = range.sizeLabel;
      const measurementCode = range.measurementType.code;

      if (!groupedMap[sizeLabel]) {
        groupedMap[sizeLabel] = {
          sizeLabel,
          measurements: {}
        };
      }

      groupedMap[sizeLabel].measurements[measurementCode] = {
        min: range.minValue,
        max: range.maxValue
      };
    }

    return Object.values(groupedMap);
  }
}