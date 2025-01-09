import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const { content } = req.body;

        if (!content) {
            throw new ApiError(
                400,
                "Content is required"
            )
        }

        const tweet = await Tweet.createTweet(
            {
                content,
                owner: req.user._id
            }
        )

        if (!tweet) {
            throw new ApiError(
                500,
                "Failed to create tweet , Please try again"
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tweet,
                    "Tweet created successfully"
                )
            )
    } catch (error) {
        throw new ApiError(`Failed to create tweet , Please check ${error.message}`)
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    try {
        const { tweetId } = req.params;
        const { content } = req.body;

        if (!content) {
            throw new ApiError(
                400,
                "Content is required to update tweet"
            )
        }

        if (!isValidObjectId(tweetId)) {
            throw new ApiError(
                400,
                "Invalid tweetId"
            )
        }

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(
                404,
                "Tweet is not found"
            )
        }

        if (tweet?.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(
                400,
                "Only owner can update there tweet"
            )
        }

        const newTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: {
                    content
                },
            },
            {
                new: true
            }
        )

        if (!newTweet) {
            throw new ApiError(
                500,
                "Failed to update tweet , Please try again"
            )
        }
    } catch (error) {
        throw new ApiError(400, "Failed to update , Please check");
    }

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    try {
        const { tweetId } = req.params;

        if (!isValidObjectId(tweetId)) {
            throw new ApiError(
                400,
                "Invalid tweetId"
            )
        }

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(
                404,
                "Tweet not found"
            )
        }

        if (tweet?.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(
                400,
                "Only owner can delete there tweet"
            )
        }

        await Tweet.findByIdAndDelete(tweetId);

        return res
            .status(200)
            .json(
                200,
                { tweetId },
                "Tweet deleted successfully"
            )

    } catch (error) {
        throw new ApiError(400, "Failed to delete tweet ")
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}