import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import {IDataProviderService, DataProviderListParams, DataProviderResponse} from "./DataProvider";

import data from "./data.json";

type Category = {
  id?: number;
  title: string;
}

type Author = {
  id?: number;
  name: string;
}

type BlogPost = {
  id?: number;
  title: string;
  content: string;
  author_id?: number;
  author_name?: string;
  category_ids?: number[];
  status: string;
  created_at: string;
}

let bd: BlogPost[] = data.blogPosts;
let cd: Category[] = data.categories;
let ad: Author[] = data.authors;

@GenezioDeploy()
export class BlogPosts implements IDataProviderService<BlogPost>{
  constructor() {}

  async getList(context: GnzContext, {pagination, sorters, filters} : DataProviderListParams) {
    let r:DataProviderResponse<any> = {data: [] as Record<string, any>, total: 0};
    bd.forEach((item:any) => {
      // const cat = cd.find((c) => c.id == item.category.id);
      // if (cat) item.category = cat;

      const aut = ad.find((a) => a.id == item.author_id);
      if (aut) item.author_name = aut.name;

      r.data.push(item);
    });
    r.total = r.data.length;

    const {current, pageSize} = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    r.data = r.data.slice(startIndex, endIndex);
    return r;
  }
  
  async getOne(context: GnzContext, id: number) {
    let r = {data: bd.find((item) => item.id == id), total: 1};
    if (r.data) {
      // const cat = cd.find((item) => item.id == r.data?.category.id);
      // if (cat) r.data.category = cat;

      const aut = ad.find((item) => item.id == r.data?.author_id);
      if (aut) r.data.author_name = aut.name;
    }
    return r;
  }
  
  @GenezioAuth()
  async create(context: GnzContext, bp: BlogPost) {
    bp.id = bd.length + 1;
    bd.push(bp);
    return bd.find((item) => item.id == bd.length);
  }
  
  async update(context: GnzContext, bp: BlogPost) {
      const index = bd.findIndex((item) => item.id == bp.id);
      if (index === -1) throw new Error("Not found");
      bd[index] = bp;
      return bd[index];
  }
  
  async deleteOne(context: GnzContext, id: number) {
    const index = bd.findIndex((item) => item.id == id);
    if (index === -1) throw new Error("Not found");
    bd.splice(index, 1);
    return true;
  }
}