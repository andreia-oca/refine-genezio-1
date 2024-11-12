import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import {IDataProviderService, DataProviderListParams} from "./DataProvider";
import {connectDB, fixId, AuthorModel, Author} from './MongoService';

@GenezioDeploy()
export class Authors implements IDataProviderService<Author> {
  constructor() {
    connectDB();
  }

  async getList(_context: GnzContext, { pagination, sorters, filters }: DataProviderListParams) {
    const { current, pageSize } = pagination;
    let query = AuthorModel.find();

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.field === "name" && filter.operator === "contains" && filter.value) {
          query = query.where('name', new RegExp(filter.value, 'i'));
        }
      });
    }

    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      query = query.sort({ [sorter.field]: sorter.order === 'asc' ? 1 : -1 });
    }

    const total = await AuthorModel.countDocuments(query.getFilter());
    const data = await query.skip((current - 1) * pageSize).limit(pageSize);

    return { data, total };
  }

  async getOne(_context: GnzContext, id: string) {
    const data = await AuthorModel.findById(id).lean();
    return { data: data || undefined, total: data ? 1 : 0 };
  }

  async getMany(_context: GnzContext, ids: string[]) {
    const data = await AuthorModel.find({ _id: { $in: ids } });
    return { data, total: data.length };
  }

  @GenezioAuth()
  async create(context: GnzContext, a: Author) {
    console.log("User: ", context.user?.email, " created an Author");
    const newAuthor = new AuthorModel(a);
    return await newAuthor.save();
  }

  @GenezioAuth()
  async update(context: GnzContext, a: Author) {
    console.log("User: ", context.user?.email, " updated an Author");
    fixId(a);
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(a._id, a, { new: true });
    if (!updatedAuthor) throw new Error("Not found");
    return updatedAuthor;
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, id: string) {
    console.log("User: ", context.user?.email, " deleted an Author");
    const deletedAuthor = await AuthorModel.findByIdAndDelete(id);
    if (!deletedAuthor) throw new Error("Not found");
    return true;
  }
}
