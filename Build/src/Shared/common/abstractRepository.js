"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class AbstractRepository {
    constructor(schemaModel) {
        this.schemaModel = schemaModel;
        this.DEFAULTPAGINATIONOPTIONS = {
            limit: 10,
            page: 1,
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    findOne(schemaFilterQuery, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(schemaFilterQuery);
            return (yield this.schemaModel
                .findOne({ _id: schemaFilterQuery.id })
                .lean()
                .exec());
        });
    }
    find(schemaFilterQuery //FilterQuery<T>
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schemaModel.find(schemaFilterQuery).lean().exec();
        });
    }
    create(createSchemaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = new this.schemaModel(createSchemaData);
            if (schema.companyId) {
                const { companyId } = schema;
                const newObject = new mongoose_1.default.Types.ObjectId(companyId);
                schema.companyId = newObject;
            }
            console.log(schema);
            return schema.save();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemaModel.findByIdAndDelete({ id });
            return schema;
        });
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    updateOne(id, updateFieldDto) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id, updateFieldDto);
            yield this.schemaModel
                .findOneAndUpdate({ _id: id }, { $set: updateFieldDto })
                .exec();
            return yield this.findOne({ id });
        });
    }
    count(schemaFilterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schemaModel
                .find(schemaFilterQuery)
                .countDocuments()
                .lean()
                .exec();
        });
    }
    findAndPaginate(schemaFilterQuery, options = this.DEFAULTPAGINATIONOPTIONS) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 10, page = 1 } = options;
            const [data, total] = yield Promise.all([
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
        });
    }
    getMeta({ total, data, limit, page }) {
        return {
            totalItems: total,
            count: data === null || data === void 0 ? void 0 : data.length,
            itemsPerPage: limit,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }
}
exports.AbstractRepository = AbstractRepository;
