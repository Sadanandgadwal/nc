import { Request, Response } from "express";
import responses from "../utils/responses";
import User from "../models/user.model";
import UserRole from "../models/role_user.model";
// import cloudinary from 'cloudinary';
import multer from 'multer';
import * as dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import Blog from '../models/blog.model';
// Configure cloudinary
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'ProfileUploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

// Create multer upload instance
const ProfileUploads = multer({ storage: storage });

async function uploadFile(filePath:string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, { tags: 'sample_upload' });
    console.log('Upload Successful:');
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error('Upload Error:');
    console.error(error);
    throw error;
  }
}

export const update = async (req:Request, res:Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return responses.unauthorizedResponse(res, null, 'Invalid user');
    }

    const { name, mobile, gender, web_link } = req.body;

    // Update user fields
    user.name = name;
      user.mobile = mobile;
      user.gender=gender,
      user.web_link=web_link
    // user.email = email;

    // Handle image upload
    if (req.file) {
      const fileToUpload = req.file.path;
      const fileAddress = await uploadFile(fileToUpload);
      user.profilePic = fileAddress;
    }

    // Save the updated user
    const updatedUser = await user.save();
    return responses.successResponse(res, updatedUser);
  } catch (error) {
    console.log(error);
    return (error);
    return responses.serverErrorResponse(res);
  }
};
export const updateMiddleware = [ProfileUploads.single('file')];


export const get = async (req: Request, res: Response) => {
  try {
    if (!req.params.id)
      return responses.badRequestResponse(res, { error: "User ID required" });
    let user = await User.findById(req.params.id);
    if (!user) return responses.notFoundResponse(res, "User Not Found..");
    let user_role = await UserRole.find({ user_id: req.params.id }).populate(
      "role_id"
    );
    let response = { user, user_role };
    return responses.successResponse(res, response, "User Found..");
  } catch (error) {
    console.log(error);
    return responses.serverErrorResponse(res);
  }
};
export const changeStatus= async (req:Request,res:Response)=>{
try{  
  const user_id=req.body;
  const filter={_id:req.body.user_id};
  if(user_id.status==="blocked")
    {
    const update={status:"unblocked"};
    const userUnblocked=await User.findOneAndUpdate(filter,update);
    return responses.successResponse(res, userUnblocked);
    }
  else
    {
      const update={status:"blocked"};
      const userBlocked=await User.findOneAndUpdate(filter,update);
      console.log('-----------',userBlocked);
      return responses.successResponse(res,userBlocked);
    }
  }
  catch(error)
  {
    console.log(error);
     return responses.serverErrorResponse(res);
  }
}
export const blockedUserList = async (req: Request, res: Response) => {
 // console.log("________________________");
  try {
    const blockedUsers = await User.aggregate([
      { $match: { status: "blocked" } },
    ]);

    if (blockedUsers.length === 0) {
      return responses.successResponse(res, 'No one is a blocked user');
    } else {
      return responses.successResponse(res, blockedUsers);
    }
  } catch (error) {
    console.log(error);
    return responses.serverErrorResponse(res);
  }
};
//to delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return responses.unauthorizedResponse(res, null, 'Invalid user');
    }

    // Check if any blogs exist for the user
    const blogs = await Blog.find({ userId }); // Assuming the user ID field in the Blog model is named 'userId'

    if (blogs.length > 0) {
      return responses.unauthorizedResponse(res, null, 'Cannot delete user. Blogs exist.');
    }

    // Delete the user
    await user.remove();

    return responses.successResponse(res, 'User deleted successfully');
  } catch (error) {
    console.log(error);
    return responses.serverErrorResponse(res);
  }
};














// export const blockedUserList = async (req: Request, res: Response) => {
//   console.log("________________________");
//   try {
//     const blockedUsers = await User.aggregate([
//       { $match: { status: "blocked" } },
//     ]);

//     if (blockedUsers.length === 0) {
//       return responses.successResponse(res, 'No one is a blocked user');
//     } else {
//       return responses.successResponse(res, blockedUsers);
//     }
//   } catch (error) {
//     console.log(error);
//     return responses.serverErrorResponse(res);
//   }
// };
