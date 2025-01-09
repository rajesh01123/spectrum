import express from 'express'
import { Profile, ProfilePost, changepass, homePage, loginAdmin, loginPage, logout, updateadminpic,viewUser,viewUserPost,viewUsers,deletuser, addmatch, addmatch_post, viewmatch, eventcategory, eventcat_post, vieweventcat, editevent, edit_event_post, deletevent, forgotpassword, sendotp, addUser, pandp, tandc, notify, otpverify, resetpassword, TermsConditions, deletTerm } from '../controllers/adminController.js';


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

router.route('/viewUser').post(isAuthenticatedAdmin,viewUserPost)

router.route('/deleteUser').delete(deletuser)

// match

router.route('/addmatch').get(isAuthenticatedAdmin,addmatch)

router.route('/addmatch').post(isAuthenticatedAdmin,addmatch_post)

router.route('/viewmatch').get(isAuthenticatedAdmin,viewmatch)


//-----------------------------------event category------------------------

router.route('/eventcategory').get(isAuthenticatedAdmin,eventcategory);

router.route('/eventcategory').post(isAuthenticatedAdmin,upload.single('image'),eventcat_post);

router.route('/vieweventcat').get(isAuthenticatedAdmin, vieweventcat);

router.route('/edit_events').get(isAuthenticatedAdmin,editevent);

router.route('/edit_events').post(isAuthenticatedAdmin ,upload.single('image'), edit_event_post);

router.route('/deletevent').delete(deletevent);



router.route('/pandp').get(isAuthenticatedAdmin,pandp)



router.route('/notify').get(isAuthenticatedAdmin,notify)


//-------------------term and condition--------------
router.route('/tandc').get(isAuthenticatedAdmin,tandc)

router.route('/termsConditions').post(isAuthenticatedAdmin,TermsConditions);

router.route('/deleteterm').delete(deletTerm);






export default router