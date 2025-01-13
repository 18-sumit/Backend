import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.models.js"
import { Like } from "../models/Like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    try {
        const { videoId } = req.params
        const { page = 1, limit = 10 } = req.query

        // check if videoId is invalid:
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Video does not exist");
        }

        if(!videoId){
            throw new ApiError(
                404,
                "Video not found"
            )
        }

        const commentsAggregate = Comment.aggregate([
            {
                $match:{
                    video : new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner"
                }
            },
            {
                $lookup:{
                    from :"likes",
                    localField:"_id",
                    foreignField:"comment",
                    as:"likes"
                }
            },
        ])

    } catch (error) {

    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    try {

        const { videoId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            throw new ApiError(
                400,
                "Comment is required"
            )
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(
                404,
                "Video not found"
            )
        }

        const comment = await Comment.create(
            {
                content,
                video: videoId,
                owner: req.user._id
            }
        )

        if (!comment) {
            throw new ApiError(
                500,
                "Failed to add a comment , Please try again"
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    comment,
                    "Comment added successfully"
                )
            );

    } catch (error) {
        throw new ApiError(
            400,
            `Failed to add comment , please check ${error.message}`
        )
    }
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            throw new ApiError(
                400,
                "Content is reqired to update comment"
            )
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(
                404,
                "Comment not found"
            )
        }

        if (comment?.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(
                400,
                "Only owner can update there comment"
            )
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content
                }
            },
            {
                new: true // if it is true then it returns the updated comment , else old comment
            }
        );

        if (!updatedComment) {
            throw new ApiError(
                500,
                "Failed to update comment , please try again"
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedComment,
                    "Comment updated successfully"
                )
            )

    } catch (error) {
        throw new ApiError(400, `Failed to update comment , please check ${error.message}`)
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(400, "Commment not found");
        }

        // check if the user id owner of comment:
        if (comment?.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(
                400,
                "Only owner can delete there comment"
            )
        }

        await Comment.findByIdAndDelete(commentId)

        // delete likes associated with the comment from DB:
        await Like.deleteMany({
            comment: commentId,
            likedBy: req.user
        })

        return res
            .status(200)
            .json(
                200,
                { commentId },
                "Comment deleted successfully"
            )
    } catch (error) {
        throw new ApiError(400, `Failed to delete comment , please check ${error.message}`);
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}