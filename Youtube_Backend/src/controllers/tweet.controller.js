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
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}