import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    try {

        if (!isValidObjectId(videoId)) {
            throw new ApiError(
                400,
                "Invalid videoId"
            )
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(
                404,
                "Video not found"
            );
        }

        if (!req.user || !req.user._id) {
            throw new ApiError(
                401,
                "User not authenticated"
            );
        }

        const likedAlready = await Like.findOne({
            video: videoId,
            likedBy: req.user?._id,
        });

        if (likedAlready) {
            // If already liked, remove the like
            await Like.findByIdAndDelete(likedAlready._id);

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { isLiked: false }
                    )
                );
        }

        // If not liked, create a new like entry
        await Like.create({
            video: videoId,
            likedBy: req.user._id,
        })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: true }
                )
            )

    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    try {

        if (!isValidObjectId(commentId)) {
            throw new ApiError(
                400,
                "Invalid commentId"
            );
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new ApiError(
                404,
                "No comment found"
            )
        }

        if (!req.user || !req.user._id) {
            throw new ApiError(
                401,
                "Unauthorized user"
            );
        }

        const likedAlready = await Like.findOne({
            comment: commentId,
            likedBy: req.user._id,
        })

        if (likedAlready) {
            await Like.findByIdAndDelete(likedAlready._id)
            return res
                .status(200)
                .json(
                    200,
                    { isLiked: false }
                );
        }

        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isLiked: true }
                )
            );

    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);
    }

});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}