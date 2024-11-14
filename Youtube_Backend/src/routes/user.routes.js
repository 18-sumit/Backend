import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()

router.route( "/register").post(
    // ye ek middleware h
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser

)






// yaha aake router.route("ye hai route").post(route pe jaane ke baad kya hoga wo method / controller yaha )
// "/users" prefix ke baad ke main routes yaha likhe jayenge




export default router


