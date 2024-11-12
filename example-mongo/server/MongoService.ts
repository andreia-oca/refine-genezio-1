import mongoose, { Schema, Document } from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.EXAMPLE_MONGO_DATABASE_URL || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const fixId = (obj: any) => {
  if (obj.id) {
    obj._id = obj.id;
    delete obj.id;
  }
}

const AuthorSchema: Schema = new Schema({
  name: { type: String, required: true }
});

type Author = Document & {
  name: string;
}

const AuthorModel = mongoose.model<Author>('Author', AuthorSchema);

const CategorySchema: Schema = new Schema({
  title: { type: String, required: true }
});


type Category = Document & {
  title: string;
}

const CategoryModel = mongoose.model<Category>('Category', CategorySchema);

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: Schema.Types.ObjectId, ref: 'Author' },
  status: { type: String, required: true },
  category_ids: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  created_at: { type: Date, default: Date.now }
});

type BlogPost = Document & {
  title: string;
  content: string;
  author_id?: mongoose.Types.ObjectId;
  author_name?: string;
  category_ids?: mongoose.Types.ObjectId[];
  status: string;
  created_at: Date;
}

const BlogPostModel = mongoose.model<BlogPost>('BlogPost', BlogPostSchema);

export {connectDB, fixId, AuthorModel, Author, CategoryModel, Category, BlogPostModel, BlogPost};