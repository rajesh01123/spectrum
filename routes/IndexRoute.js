import express from 'express'
import {isAuthenticatedUser} from '../middleware/auth.js' ;



import { home, index, about, games, blog, contactpage, privacypolicy, termscondition, indexpost, login, regitation, regitation_post, login_post, resset, forgot, forgotpost, otp, otp_verify, resetpost, dashboard, logout, uterm, uprivacy } from '../controllers/indexController.js';
import upload from '../middleware/upload.js';



const router = express.Router(); 






//------------- Routing Start -----------------------

router.route('/admin').get(home);

//------------- Routing End  -----------------------

//--------------- get website pages--------------------------//

router.route('/').get(index);

router.route('/index').get(index);


router.route('/index').post(indexpost);

router.route('/about').get(about);

router.route('/games').get(games);

router.route('/blog').get(blog);

router.route('/contact').get(contactpage);

router.route('/privacypolicy').get(privacypolicy)

router.route('/termscondition').get(termscondition)

router.route('/dashboard').get(isAuthenticatedUser,dashboard);


// ------------------------------ login singup -----------------------

router.route('/login').get(login);

router.route('/login').post(login_post);

router.route('/regitation').get(regitation);

router.route('/regitation').post(upload.single('image'),regitation_post);


//-------------------------------- forget password ------------------------

router.route('/forgot').get(forgot);

router.route('/forgot').post(forgotpost);

router.route('/otp').get(otp);

router.route('/otp_verify').post(otp_verify);


router.route('/resset').get(resset);

router.route('/resset').post(resetpost);

router.route('/logout').get(logout);

router.route('/user_term').get(uterm);

router.route('/user_privacy').get(uprivacy);



//------------------------





export default router





















