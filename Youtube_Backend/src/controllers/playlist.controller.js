import mongoose, { isValidObjectId, set } from "mongoose"
import { Video } from "../models/video.models.js"
import { Playlist } from "../models/playlist.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    //TODO: create playlist
    try {

        if (!name || !description) {
            throw new ApiError(
                400,
                "name and description both are required"
            )
        }

        if (!req.user || !req.user._id) {
            throw new ApiError(
                401,
                "User not authenticated"
            );
        }

        const playlist = await Playlist.create({
            name,
            description,
            owner: req.user._id,
        })


        if (!playlist) {
            throw new ApiError(
                500,
                "Failed to create playlist"
            )
        }

        return res
            .status(200)
            .json(
                new ApiError(
                    200,
                    playlist,
                    "Playlist created successfully"
                )
            )
    } catch (error) {

    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params


    try {

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            throw new ApiError(
                400,
                "Invalid PlaylistId or VideoId"

            );
        }

        const playlist = await Playlist.findById(playlistId);
        const video = await Video.findById(videoId);

        if (!playlist) {
            throw new ApiError(
                404,
                "Playlist not found"
            )
        }

        if (!video) {
            throw new ApiError(
                404,
                "Video not found"
            );
        }

        if (playlist.owner.toString() && video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                400,
                "only owner can add video to their playlist"
            )
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $addToSet: {
                    videos: videoId
                }
            },
            {
                new: true
            }
        );

        if (!updatedPlaylist) {
            throw new ApiError(
                400,
                "Failed to add video to playlist , try again"
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedPlaylist,
                    "Video added to playlist successfully"
                )
            );

    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    try {

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            throw new ApiError(
                400,
                "Invalid playlistId or videoId"
            )
        }

        const playlist = await Playlist.findById(playlistId);
        const video = await Video.findById(videoId);

        if (!playlist) {
            throw new ApiError(
                404,
                "Playlist not found"
            )
        }

        if (!video) {
            throw new ApiError(
                404,
                "Video not found"
            )
        }

        if (
            (playlist.owner?._id.toString() && video.owner?.toString()) !==
            req.user?._id.toString()
        ) {
            throw new ApiError(
                404,
                "only owner can remove video from their playlist"
            );
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: {
                    videos: videoId
                },
            },
            {
                new: true
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedPlaylist,
                    "Removed video from playlist successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    try {

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            throw new ApiError(
                400,
                "Playlist not found"
            );
        }

        if (playlist.owner.toString() !== req.user._id) {
            throw new ApiError(
                400,
                "Only owner can delete their playlist"
            )
        }

        await Playlist.findByIdAndDelete(playlistId);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlistId,
                    "Playlist deleted successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    try {


        if (!name || !description) {
            throw new ApiError(
                400,
                "name and description both are required"
            );
        }

        if (!isValidObjectId(playlistId)) {
            throw new ApiError(
                400,
                "Invalid videoId"
            )
        }

        if (!req.user || !req.user._id) {
            throw new ApiError(
                401,
                "User not authenticated"
            );
        }

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            throw new ApiError(
                404,
                "Playlist not found"
            );
        }


        if (playlist?.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                400,
                "Only playlist owner can update playlist"
            )
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    name,
                    description
                }
            },
            {
                new: true
            }
        )

        if (!updatedPlaylist) {
            throw new ApiError(
                500,
                "Failed to update playlist"
            )
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedPlaylist,
                    "Playlist updated successfully"
                )
            )

    } catch (error) {
        throw new ApiError(500, `An error occurred: ${error.message}`);

    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}