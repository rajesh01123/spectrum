import express from 'express'
import {isAuthenticatedUser} from '../middleware/auth.js' ;



import { home, index, about, games, blog, contact, forgot_password, privacypolicy, termscondition, indexpost, login, regitation, regitation_post, login_post, forgat_password_post } from '../controllers/indexController.js';

const router = express.Router(); 


//------------- Routing Start -----------------------

router.route('/admin').get(home);

//------------- Routing End  -----------------------

//---------------website--------------------------//

router.route('/').get(isAuthenticatedUser,index);

router.route('/index').get(isAuthenticatedUser,index);


router.route('/index').post(indexpost);

router.route('/login').get(login);

router.route('/login').post(login_post);

router.route('/regitation').get(regitation);

router.route('/regitation').post(regitation_post);



router.route('/forgat-password').post(forgat_password_post);





router.route('/about').get(about);

router.route('/games').get(games);

router.route('/blog').get(blog);

router.route('/contact').get(contact)

router.route('/privacypolicy').get(privacypolicy)

router.route('/termscondition').get(termscondition)

router.route('/forgat-password').get(forgot_password)

export default router





















