import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // steps:
    // get user details from frontend
    // validation - fields are not empty
    // check if user already exists : check through username and email
    // check for images & avatar
    // if available upload them to cloudinary , check avatar uploaded or not
    // create user object - create entry in DB\
    // remove password and refresh token field from response
    // check for user creation
    // return response else send error

    // 1st step: get details 

    const { fullname, email, username, password } = req.body
    // console.log("email : ", email)

    // validation of field is empty
    if (
        [fullname , email , username , password].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(400 , "All the fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }] 
    })

    if ( existedUser ) {
        throw new ApiError(409 , "User with email or username already exists")
    }

    // file handling on our server 
    const avatarLocalPath = req.files?.avatar[0]?.path ;
    const coverImageLocalPath = req.files?.coverImage[0]?.path ;

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required") ;
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400 , "Avatar file is required")
    }

    // to connect everything on db :
    const user = await User.create(
        {
            fullname ,
            avatar : avatar.url ,
// as coverImage is not a req field and we have not any verification weather user has uploded any or not , so we'll just put a safety check here
            coverImage : coverImage?.url || "",
            email , 
            password ,
            username : username.toLowerCase()
        })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if( !createdUser ) {
        throw new ApiError (500 , "Something went wrong whilw registering the user")
    }


    // final returning response
    
    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered succesfully")
    )

})


export { registerUser }