import mongoose, {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
} from "mongoose";
import {
  IDefaultPaginationOptions,
  IGetMetaProps,
  IMeta,
  IPaginateResult,
} from "./abstract.Interface";
import { promises } from "fs";

export abstract class AbstractRepository<T extends Document> {
  constructor(private readonly schemaModel: Model<T>) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOne(
    schemaFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>
  ): Promise<T | null> /*Promise<any>/*Promise<LeanDocumentOrArrayWithRawType<HydratedDocument<T>, {}> | null> */ {
    console.log(schemaFilterQuery);

    return (await this.schemaModel
      .findOne({ _id: schemaFilterQuery.id })
      .lean()
      .exec()) as T | null;
  }

  async find(
    schemaFilterQuery?: Record<string, any> | any //FilterQuery<T>
  ): Promise<Document<T>[] | null> {
    return this.schemaModel.find(schemaFilterQuery).lean().exec();
  }

  async create(createSchemaData: unknown): Promise<T> {
    const schema: any = new this.schemaModel(createSchemaData);
    if (schema.companyId) {
      const { companyId } = schema;
      const newObject = new mongoose.Types.ObjectId(companyId);
      schema.companyId = newObject;
    }
    console.log(schema);

    return schema.save();
  }
  async delete(id: string): Promise<any> {
    const schema = await this.schemaModel.findByIdAndDelete({ id });
    return schema;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async updateOne(
    id: string,
    updateFieldDto: object
  ): Promise<T | null> /*Promise<any> /* Promise<LeanDocumentOrArrayWithRawType<HydratedDocument<T>, {}> | null> */ {
    console.log(id, updateFieldDto);
    await this.schemaModel
      .findOneAndUpdate({ _id: id }, { $set: updateFieldDto })
      .exec();

    return await this.findOne({ id });
  }

  async count(schemaFilterQuery: FilterQuery<T>): Promise<number> {
    return this.schemaModel
      .find(schemaFilterQuery)
      .countDocuments()
      .lean()
      .exec();
  }

  async findAndPaginate(
    schemaFilterQuery: FilterQuery<T>,
    options = this.DEFAULTPAGINATIONOPTIONS
  ): Promise<any> /*Promise<IPaginateResult<LeanDocument<T>[] | null>>*/ {
    const { limit = 10, page = 1 } = options;
    const [data, total] = await Promise.all([
      this.schemaModel
        .find(schemaFilterQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean()
        .exec(),
      this.count(schemaFilterQuery),
    ]);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }

  private DEFAULTPAGINATIONOPTIONS: IDefaultPaginationOptions = {
    limit: 10,
    page: 1,
  };

  getMeta({ total, data, limit, page }: IGetMetaProps): IMeta {
    return {
      totalItems: total,
      count: data?.length,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  
}
