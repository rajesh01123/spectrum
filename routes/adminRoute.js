import express from 'express'
import { Profile, ProfilePost, changepass, homePage, loginAdmin, loginPage, logout, updateadminpic,viewUser,viewUserPost,viewUsers,deletuser, addgame, addgame_post, viewmatch, addevent, viewevent, editevent, edit_event_post, deletevent, forgotpassword, sendotp, addUser, pandp, tandc, notify, otpverify, resetpassword, TermsConditions, deletTerm, privacyPolicy, deleteprivacy, notifypost, deletenotify, adduserpost, event, addevent_name, getevent_name, deletevent_name, edite_match, edit_game_post, booking } from '../controllers/adminController.js';


import upload from '../middleware/upload.js';
import { isAuthenticatedAdmin} from '../middleware/Adminauth.js' ;
// import { eventNames } from 'pdfkit';

const router = express.Router(); 



//------------- Web Service API Routing Start -----------------------

router.route('/').get(isAuthenticatedAdmin,homePage)

router.route('/login').get(loginPage)

router.route('/login').post(loginAdmin)

router.route('/logout').get(logout)




//------ profile section of admin

router.route('/profile').get(isAuthenticatedAdmin,Profile)

router.route('/profile').post(isAuthenticatedAdmin,upload.single('image'),ProfilePost)

router.route('/updateadminpic').post(isAuthenticatedAdmin,upload.single('image'),updateadminpic)

router.route('/changepass').post(isAuthenticatedAdmin,changepass)

//-----------forget Password

router.route('/ForgotPassword').get(forgotpassword);

router.route('/sendOTP').post(sendotp);

router.route('/verify-otp').post(otpverify);

router.route('/reset-password').post(resetpassword);






//----- END WEB SERVICE APIs==

// user
router.route('/addUser').get(isAuthenticatedAdmin,addUser)

router.route('/viewUsers').get(isAuthenticatedAdmin,viewUsers)

router.route('/viewUser').get(isAuthenticatedAdmin,viewUser)

router.route('/addUser').post(isAuthenticatedAdmin,upload.single('image'),adduserpost)

router.route('/viewUser').post(isAuthenticatedAdmin,upload.single('image'),viewUserPost)

router.route('/deleteUser').delete(deletuser)

// match

router.route('/addgame').get(isAuthenticatedAdmin,addgame)

router.route('/addgame').post(isAuthenticatedAdmin,addgame_post)

router.route('/viewmatch').get(isAuthenticatedAdmin,viewmatch)

router.route('/editmatch').get(isAuthenticatedAdmin,edite_match);

router.route('/editgame').post(isAuthenticatedAdmin,edit_game_post);








//-----------------------------------event category------------------------


router.route('/addevent_name').get(isAuthenticatedAdmin,getevent_name);


router.route('/addevent_name').post(isAuthenticatedAdmin,upload.single('image'),addevent_name);

router.route('/addevent').get(isAuthenticatedAdmin,addevent);

router.route('/event').post(isAuthenticatedAdmin,upload.single('image'),event);

router.route('/viewevent').get(isAuthenticatedAdmin,viewevent);

router.route('/deletevent').delete(deletevent);

router.route('/edit_event').get(isAuthenticatedAdmin,editevent);

router.route('/edit_event').post(isAuthenticatedAdmin,edit_event_post);



router.route('/deletevent_name').delete(deletevent_name);







// router.route('/edit_event').get(isAuthenticatedAdmin,editevent);

// router.route('/edit_events').post(isAuthenticatedAdmin ,upload.single('image'), edit_event_post);









router.route('/notify').get(isAuthenticatedAdmin,notify)


//-------------------term and condition--------------
router.route('/tandc').get(isAuthenticatedAdmin,tandc)

router.route('/termsConditions').post(isAuthenticatedAdmin,TermsConditions);

router.route('/deleteterm').delete(deletTerm);


//------------------------privacy policy------------------


router.route('/pandp').get(isAuthenticatedAdmin,pandp)

router.route('/privacyPolicy').post(isAuthenticatedAdmin,privacyPolicy);

router.route('/deleteprivacy').delete(deleteprivacy);


//--------------------notification----------------------
router.route('/notify').post(isAuthenticatedAdmin,notifypost)

router.route('/deletenotify').delete(deletenotify)

//--------------------booking----------------------

router.route('/booking').get(isAuthenticatedAdmin,booking);










export default router