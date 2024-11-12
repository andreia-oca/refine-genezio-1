import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import { IDataProviderService, DataProviderListParams } from "./DataProvider";
import {connectDB, fixId, BlogPostModel, BlogPost} from './MongoService';

@GenezioDeploy()
export class BlogPosts implements IDataProviderService<BlogPost> {

  constructor() {
    connectDB();
  }

  async getList(_context: GnzContext, { pagination, sorters, filters }: DataProviderListParams) {
    const { current, pageSize } = pagination;
    let query = BlogPostModel.find();//.populate('author_id', 'name');

    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        if (filter.field && filter.operator === "contains" && filter.value) {
          query = query.where(filter.field, new RegExp(filter.value, 'i'));
        }
      });
    }

    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      query = query.sort({ [sorter.field]: sorter.order === 'asc' ? 1 : -1 });
    }

    const total = await BlogPostModel.countDocuments(query.getFilter());
    const data = await query.skip((current - 1) * pageSize).limit(pageSize).lean();

    return { data, total };
  }

  async getOne(_context: GnzContext, id: string) {
    const data = await BlogPostModel.findById(id);//.populate('author_id', 'name').lean();
    return { data: data || undefined, total: 1 };
  }

  @GenezioAuth()
  async create(context: GnzContext, bp: BlogPost): Promise<BlogPost> {
    console.log("User: ", context.user?.email, " created a BlogPost");
    const newBlogPost = new BlogPostModel(bp);
    const savedBlogPost = await newBlogPost.save();
    return savedBlogPost.toObject();
  }

  @GenezioAuth()
  async update(context: GnzContext, bp: BlogPost): Promise<BlogPost> {
    console.log("User: ", context.user?.email, " updated a BlogPost");
    fixId(bp);
    const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(bp._id, bp, { new: true, lean: true });
    if (!updatedBlogPost) throw new Error("Not found");
    return updatedBlogPost;
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, id: string): Promise<boolean> {
    console.log("User: ", context.user?.email, " deleted a BlogPost");
    const deletedBlogPost = await BlogPostModel.findByIdAndDelete(id);
    if (!deletedBlogPost) throw new Error("Not found");
    return true;
  }

  async getMany(_context: GnzContext, ids: string[]) {
    const data = await BlogPostModel.find({ _id: { $in: ids } });//.populate('author_id', 'name').lean();
    return { 
      data,
      total: data.length 
    };
  }
}