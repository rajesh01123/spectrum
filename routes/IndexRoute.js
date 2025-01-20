import express from 'express'
import {isAuthenticatedUser} from '../middleware/auth.js' ;



import { home, index, about, games, blog, contactpage, uviewevent, booking_history, privacypolicy, termscondition, indexpost, login, regitation, regitation_post, login_post, resset, forgot, forgotpost, otp, otp_verify, resetpost, dashboard, logout, uterm, uprivacy, uprofile_get, uprofile_post, uchangepass, uviewevent_details } from '../controllers/indexController.js';
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

router.route('/booking_history').get(isAuthenticatedUser,booking_history);

router.route('/uviewevent').get(isAuthenticatedUser,uviewevent);

router.route('/uviewevent_details').get(isAuthenticatedUser,uviewevent_details);



// ------------------------------ login singup -----------------------

router.route('/login').get(login);

router.route('/login').post(login_post);

router.route('/regitation').get(regitation);

router.route('/uprofile_get').get(isAuthenticatedUser,uprofile_get);

router.route('/updatae').post(isAuthenticatedUser, uprofile_post);

router.route('/uchangepass').post(isAuthenticatedUser, uchangepass);




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





















