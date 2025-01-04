import express from 'express'
import {isAuthenticatedUser} from '../middleware/auth.js' ;



import { home, index, about, games, blog, contact, privacypolicy, termscondition, indexpost, login, regitation, regitation_post, login_post, resset, forgot, forgotpost, otp, otp_verify, resetpost } from '../controllers/indexController.js';

const router = express.Router(); 


//------------- Routing Start -----------------------

router.route('/admin').get(home);

//------------- Routing End  -----------------------

//---------------website--------------------------//

router.route('/').get(index);

router.route('/index').get(index);


router.route('/index').post(indexpost);

router.route('/login').get(login);

router.route('/login').post(login_post);

router.route('/regitation').get(regitation);

router.route('/regitation').post(regitation_post);

router.route('/forgot').get(forgot);

router.route('/forgot').post(forgotpost);

router.route('/otp').get(otp);

router.route('/otp_verify').post(otp_verify);


router.route('/resset').get(resset);

router.route('/resset').post(resetpost);


router.route('/about').get(about);

router.route('/games').get(games);

router.route('/blog').get(blog);

router.route('/contact').get(contact)

router.route('/privacypolicy').get(privacypolicy)

router.route('/termscondition').get(termscondition)



export default router





















