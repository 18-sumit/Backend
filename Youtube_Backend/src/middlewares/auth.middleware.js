import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.
            replace("Bearer", "")

        // no token available , in case of mobile app
        if (!token) {
            new ApiError(401, "Unauthorized Request!");
        }

        // if token available , then decode it 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        // if we do not get a user 
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // as we know from cookieParser we can get the refrence of user to req.user
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid access token ")
    }
})