import { Router } from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js"
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

export default router


