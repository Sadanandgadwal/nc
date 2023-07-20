import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  heading: {
    type: Boolean,
    default: false,
  },
  paragraph: {
    type: Boolean,
    default: false,
  },
  image: {
    type: Boolean,
    default: false,
  },
  linebreak: {
    type: Boolean,
    default: false,
  },
  span: {
    type: Boolean,
    default: false,
  },
  bold: {
    type: Boolean,
    default: false,
  },
  italic: {
    type: Boolean,
    default: false,
  },
  underline: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
  },
  url: {
    type: String,
  },
});

const blogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    title: {
      type: String,
      default: false,
    },
    content:{
      type: String
    },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",    },
    
    date: {
      type: Date,
      default: new Date()
    },
    images: {
      type: String,
    },
    blog_status: {
      type: String,
      enum : ['progress','approved', 'reject'],
      default: 'progress'
    }
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

































































// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Users",
//     },
//     title: {
//       type: String,
//       default: false,
//     },
//     date: {
//       type: Date,
//       default: new Date()
//     },
//     categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
//     content:{
//       type:String
//     },
//     images: [{ type: String }], // Add image field to store image URLs
//     videos: [{ type: String }], // Add video field to store video URLs
//     //mANAGE BY ADMIN
//     blog_status: {
//       type: String,
//       enum : ['progress','pending','publish'],
//       default: 'progress'
//   }
//   },
//  { timestamps: true }
// );

// const Blog = mongoose.model("Blog", blogSchema);
// export default Blog;













