import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
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


    } catch (error) {

    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
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