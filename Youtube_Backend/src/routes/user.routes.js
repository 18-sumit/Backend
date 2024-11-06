import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"


const router = Router()

router.route( "/register").post(registerUser)
// yaha aake router.route("ye hai route").post(route pe jaane ke baad kya hoga wo method / controller yaha )
// "/users" prefix ke baad ke main routes yaha likhe jayenge




export default router


