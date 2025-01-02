import express from 'express'


import { home, index, about, games, blog, contact, forgot_password, privacypolicy, termscondition } from '../controllers/indexController.js';

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

router.route('/privacypolicy').get(privacypolicy)

router.route('/termscondition').get(termscondition)

router.route('/forgot-password').get(forgot_password)

export default router





















