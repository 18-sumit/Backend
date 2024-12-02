import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


// method to generate :
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken() // reference is stored in the variable

        // to save refresh tokens in db :
        user.refreshToken = refreshToken
        // to save but it's a db operation it will take time so await 
        // while saving file , mongoose models also kick in so to avoid them we use validateBeforeSave
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token ")
    }
}

// method to register user:
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


    // console.log(req.files)


    const { fullname, email, username, password } = req.body
    // console.log(req.body);

    // console.log("email : ", email)

    // validation of field is empty
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All the fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // file handling on our server 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log("This is from console ",req.files)

    // Or provide a default value if needed (like `null` or `defaultPath`)

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // Or provide a default value if needed (like `null` or `defaultPath`)

    // console.log(avatarLocalPath);
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Faild to upload on cloudinary");
    }

    // to connect everything on db :
    const user = await User.create(
        {
            fullname,
            avatar: avatar.url,
            // as coverImage is not a req field and we have not any verification weather user has uploded any or not , so we'll just put a safety check here
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong whilw registering the user")
    }


    // final returning response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesfully")
    )

});

// method to login user:
const loginUser = asyncHandler(async (req, res) => {
    // steps:
    // data from -> req body
    // find the user , if exist
    // check password 
    // access and refresh token 
    // send secure cookies


    const { email, username, password } = req.body

    // console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // Here is an alternative of above code based on logic 
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
    // }


    // check any one of these : email & username in db 
    // await cuz DB is in another continent 
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    // if the user with a username and email not found in db
    if (!user) {
        throw new ApiError(404, "User does not exist!")
    }

    // if user found in db , then check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    // check password is valid or not
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credential ")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //but on line no135 we have user but it does not have any refresh token because the method for it is called later
    // so here we are updating it with new information .

    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken") // select field ignore these values and accept rest all

    // to send cookies :
    // without these options , cookies can be modified by anyone through frontend 
    // but after enabling these below two fields as true , cookies are only modifieable on server not from frontend.

    const options = {
        httpOnly: true,
        secure: true
    }

    // after res.status(200).cookie().cookie().. we can send as many cookie we want

    return res.
        status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            )
        )
});

//method to logout user :

const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined // reset the token
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200), {}, "User Logged Out");
})


const refreshAccessToken = asyncHandler(async (req, res) => {

    // OR condition is for user if they are on mobile app
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        // if both are not equal 
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used")
        }


        const options = {
            httpOnly: true,
            secure: true
        }

        // generate tokens before options or after 
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookies("accessToken", accessToken, options)
            .cookies("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"

                )
            )

    } catch (error) {
        throw new ApiError(401, error.message || "Invalid Refresh Token")
    }

});

//method to change password: 
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old password");
    }

    // update password 
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )


});


//method for getCurrent User:
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            200,
            req.user,
            "current user fetched successfully"
        )
});

// method for accont update:

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email, } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    // finding the user 
    const user = User.findByIdAndUpdate(
        req.user?._id, // finding the user from req.user , refer authMiddleware
        {
            $set: {
                // fullname : fullname equivalent to fullname itself in ES6
                // fullname : fullname
                fullname,
                email,


            }
        },
        { new: true } // if new = true , after update new information will be returned
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account detail updated successfully"))
});

// method to update avatar :

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.field?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, " avatar File is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        new ApiError(400, "Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(200, user, "Avatar Updated Successfully ")
});


//method to update CoverImage :

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.field?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, " CoverImage File is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        new ApiError(400, "Error while uploading on coverImage");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            200,
            new ApiResponse(200, user, "CoverImage Updated Successfully")
        )
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}