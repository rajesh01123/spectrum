import express from 'express'


import { about, blog, contact, forgot_password, games, home, index } from '../controllers/indexController.js';

const router = express.Router(); 


//------------- Routing Start -----------------------

router.route('/').get(home);

//------------- Routing End  -----------------------

//---------------website--------------------------//

router.route('/index').get(index);

router.route('/about').get(about);

router.route('/games').get(games);

router.route('/blog').get(blog);

router.route('/contact').get(contact)

router.route('/forgot-password').get(forgot_password)



export default router





















