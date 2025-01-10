import express from 'express'
import { Profile, ProfilePost, changepass, homePage, loginAdmin, loginPage, logout, updateadminpic,viewUser,viewUserPost,viewUsers,deletuser, addgame, addgame_post, viewmatch, eventtype, addevent, viewevent, editevent, edit_event_post, deletevent, forgotpassword, sendotp, addUser, pandp, tandc, notify, otpverify, resetpassword, TermsConditions, deletTerm, privacyPolicy, deleteprivacy, notifypost, deletenotify, adduserpost } from '../controllers/adminController.js';


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

router.route('/viewUser').post(isAuthenticatedAdmin,viewUserPost)

router.route('/deleteUser').delete(deletuser)

// match

router.route('/addgame').get(isAuthenticatedAdmin,addgame)

router.route('/addgame').post(isAuthenticatedAdmin,addgame_post)

router.route('/viewmatch').get(isAuthenticatedAdmin,viewmatch)


//-----------------------------------event category------------------------

router.route('/eventtype').get(isAuthenticatedAdmin,eventtype);

router.route('/addevent').get(isAuthenticatedAdmin,addevent);

router.route('/viewevent').get(isAuthenticatedAdmin, viewevent);

router.route('/edit_events').get(isAuthenticatedAdmin,editevent);

router.route('/edit_events').post(isAuthenticatedAdmin ,upload.single('image'), edit_event_post);

router.route('/deletevent').delete(deletevent);







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









export default router