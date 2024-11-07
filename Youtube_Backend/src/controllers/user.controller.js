import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async (req , res) => {
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

    const {fullname , email , username , password} = req.body
    console.log("email : ", email)

})


export {registerUser}