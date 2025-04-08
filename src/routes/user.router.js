import {Router} from 'express'
import {registerUser, login, logout, refreshedAccessToken} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router=Router();

router.route('/register').post(upload.fields(
   [ {
        name:"avatar",
        maxSize:1
    },{
        name:"coverImage",
        maxSize:1
    }]
),registerUser)

router.route('/login').post(login)

router.route('/logout').post(verifyJWT, logout)
router.route('/refresh-token').post(refreshedAccessToken)


export default router;