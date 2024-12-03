import { Router } from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    // ye ek middleware h
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser

)
// yaha aake router.route("ye hai route").post(route pe jaane ke baad kya hoga wo method / controller yaha )
// "/users" prefix ke baad ke main routes yaha likhe jayenge

router.route("/login").post(loginUser)


// secured routes 
router.route("/logout").post(verifyJWT, logoutUser) // verifyJWT is a middleware here
router.route("/refresh-token").post(refreshAccessToken)

//only loggedIn user can do it so we are using verifyJWT 
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

// as user is not sending any data so we can user get
router.route("/current-user").get(verifyJWT, getCurrentUser)

// .patch() method is used in HTTP requests to update partial data on a resource. 
router.route("/update-account").patch(verifyJWT, updateAccountDetails)



//Handling URL data : patch of partial update of avatar , and verifyJWT for user loggedIn , and upload.single form multer to get a single file instead of files
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// Handling data with params :
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)


router.route("/history").get(verifyJWT, getWatchHistory)

export default router


