import express from 'express'
import { Profile, ProfilePost, changepass, homePage, loginAdmin, loginPage, logout, updateadminpic,viewUser,viewUserPost,viewUsers,deletuser, addmatch, addmatch_post, viewmatch, eventcategory, eventcat_post } from '../controllers/adminController.js';


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






//----- END WEB SERVICE APIs==

// user
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





export default router