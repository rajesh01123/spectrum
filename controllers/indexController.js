
// import connection from "../config"
import { query } from 'express';
import connection from '../config.js';
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';



// import { output } from "pdfkit";
        const home = async(req,res,next)=>{

          res.redirect('/admin')


        }

        const index = async(req,res,next)=>{

          res.render('index', {'output':''})
          // res.redirect('/views')

        }

        const login = async (req,res,next)=>{

          res.render('login',{'output':''});

        }

        const login_post=async(req,res,next)=>{
          const con=await connection();
          const{email,password}=req.body;
          console.log(req.body);
          try{
            await con.beginTransaction();
            const[results]=await con.query('SELECT * FROM tbl_user WHERE email = ? ',[email]);
            const user=results[0];
            if(!user){
            res.render('login',{'output':'envalid user'});

            }else if(user.password != password){
              res.render('login',{'output':'user password wrong'});
            
            }else{
              sendTokenUser(user,200,res);
              res.render('login',{'output':'login success'});

              console.log('success')
            }

          }catch(error){
            console.log(error);

          }finally{
            await con.release();
            
          }
          
        }

        const regitation=async(req,res,next) =>{
          res.render('regitation',{'output':''});

        }

        const regitation_post = async (req, res, next) => {
          const con = await connection();
          console.log(req.body);
          const { username, email, contact, password, gender, address, state, birthday } = req.body;
          
          try {
            await con.beginTransaction();
            
            // Corrected query: placeholders without single quotes
            await con.query(
              "INSERT INTO `tbl_user` (`user_name`, `email`, `contact`, `password`, `address`, `gender`, `birthday_date`, `state`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
              [username, email, contact, password, address, gender, birthday, state]
            );
            
            await con.commit();

            res.render('login', { output: 'User registration successful' });
            
          } catch (error) {
            // Handle error and rollback transaction
            await con.rollback();
            res.render('admin/kilvish500', { output: 'Internal Server Error' });
            console.error(error);
          } finally {
            con.release(); // Release the connection back to the pool
          }
        }



        const indexpost = async(req,res,next)=>{
          // const con = await connection();
          try{
          const{username, password}=req.body;
          console.log(username);
          if(!username || !password){
            res.render('forgot-password', {'output':'enter user name and email'});
            console.log('Enter data');


          
          }
          }catch(error){
            console.log(error);
          }


          


        }

        const forgot_password=async(req,res,next)=>{

          res.render('/forgat-password',{'output':''});

        }

        const forgat_password_post= async(req,res,next)=>{
         const con= await connection();
         const {email} =req.body;
         console.log(req.body);
         try{
          const [results] = await con.query("SELECT * FROM tbl_user WHERE email=?",[email]);
          const detail=results[0];
          console.log(detail);
          if(!results){
          res.render('forgot-password',{'output':'invalid email'});

          }else{
            res.render('forgot-password',{'output':'enter otp which is send on your email'});
          }

         }catch(error){
          console.log(error);
         }





        }



const about = async(req,res,next)=>{
  res.render('about')

}

const games = async(req,res,next)=>{
  res.render('games') 
}

const blog = async(req,res,next)=>{
  res.render('blog') 


}

const contact = async(req,res,next)=>{
  res.render('contact') 
 
}
const privacypolicy=async(req,res,next)=>{

  res.render('privacypolicy') 

}

const termscondition=async(req,res,next)=>{

  res.render('termscondition') 

}




  //--------------------- Export Start ------------------------------------------
export { home ,login,login_post,regitation,regitation_post, forgat_password_post, index ,indexpost, about , games, blog, contact, forgot_password, privacypolicy, termscondition }


         
