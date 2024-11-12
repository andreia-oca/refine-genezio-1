import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import {IDataProviderService, DataProviderListParams} from "./DataProvider";
import {connectDB, Category, CategoryModel, fixId} from './MongoService';

@GenezioDeploy()
export class Categories implements IDataProviderService<Category>{
  constructor() {
    connectDB();
  }

  async getList(_context: GnzContext, { pagination, sorters, filters }: DataProviderListParams) {
    const { current, pageSize } = pagination;
    let query = CategoryModel.find();

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.field === "title" && filter.operator === "contains" && filter.value) {
          query = query.where('title', new RegExp(filter.value, 'i'));
        }
      });
    }

    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      query = query.sort({ [sorter.field]: sorter.order === 'asc' ? 1 : -1 });
    }

    const total = await CategoryModel.countDocuments(query.getFilter());
    const data = await query.skip((current - 1) * pageSize).limit(pageSize);

    return { data, total };
  }

  async getOne(_context: GnzContext, id: string) {
    const data = await CategoryModel.findById(id).lean();
    return { data: data || undefined, total: data ? 1 : 0 };
  }

  async getMany(_context: GnzContext, ids: string[]) {
    const data = await CategoryModel.find({ _id: { $in: ids } });
    return { data, total: data.length };
  }

  @GenezioAuth()
  async create(context: GnzContext, c: Category) {
    console.log("User: ", context.user?.email, " created an Category");
    const newCategory = new CategoryModel(c);
    return await newCategory.save();
  }

  @GenezioAuth()
  async update(context: GnzContext, c: Category) {
    console.log("User: ", context.user?.email, " updated an Category");
    fixId(c);
    const updatedCategory = await CategoryModel.findByIdAndUpdate(c._id, c, { new: true });
    if (!updatedCategory) throw new Error("Not found");
    return updatedCategory;
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, id: string) {
    console.log("User: ", context.user?.email, " deleted an Category");
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) throw new Error("Not found");
    return true;
  }
}
