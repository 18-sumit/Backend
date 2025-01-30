import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    try {
        if (isValidObjectId(channelId)) {
            throw new ApiError(400, "Invalid channelId")
        }

        const channelid = await Subscription.findOne(channelId);
        if (!channelid) {
            throw new ApiError(
                404,
                "Channel not found"
            );
        }

        if (!req.user || !req.user._id) {
            throw new ApiError(
                401,
                "User not authenticated"
            );
        }

        const subscribedAlready = await Subscription.findOne({
            channel: channelId,
            subscriber: req.user._id
        });

        if (subscribedAlready) {
            await Subscription.findByIdAndDelete(subscribedAlready._id);

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { isSubscribed: false },
                        "unsubscribed successfully"
                    )
                );
        }

        await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { isSubscribed: true },
                    "subscribed successfully"
                )
            );


    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);

    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params

        if (!isValidObjectId(channelId)) {
            throw new ApiError(400, "Invalid channelId");
        }

        const subscribers = await Subscription.aggregate([

            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscriber",
                    pipeline: [
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "channel",
                                as: "subscribedToSubscriber"
                            }
                        },
                        {
                            $addFields: {
                                subscribedToSubscriber: {
                                    $cond: {
                                        if: {
                                            $in: [
                                                channelId,
                                                "$subscribedToSubscriber.subscriber"
                                            ],
                                        },
                                        then: true,
                                        else: false
                                    },
                                },
                                subscribersCount: {
                                    $size: "$subscribedToSubscriber",
                                }
                            }
                        },

                    ]
                }
            },
            {
                $unwind: "$subscriber"
            },
            {
                $project: {
                    _id: 0,
                    subscriber: {
                        _id: 1,
                        username: 1,
                        fullName: 1,
                        "avatar.url": 1,
                        subscribedToSubscriber: 1,
                        subscribersCount: 1
                    }
                }
            }
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    subscribers,
                    "Subscribers fetched successfully"
                )
            );

    } catch (error) {
        throw new ApiError(
            400,
            "Failed to fetch subscribers"
        )
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}