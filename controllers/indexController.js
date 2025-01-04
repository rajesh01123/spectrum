
// import connection from "../config"
import { query } from 'express';
import connection from '../config.js';
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
// import { isLength } from 'html2canvas/dist/types/css/types/length.js';
import { sendOTPFornewPass } from '../middleware/helper.js'
// import { verify } from 'jsonwebtoken';




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
      // res.render('login',{'output':'login success'});

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

const forgot = async(req,res,next)=>{

   res.render('forgot')

}

const forgotpost = async(req,res,next)=>{
  const con =await connection();

  const {email}=req.body;
  console.log(email);
  try{
    await con.beginTransaction();
   const [data]= await con.query('SELECT * from tbl_user WHERE email=?',[email]);
   const user_detail=data[0];

   console.log(user_detail);
   if(user_detail.length){
    res.render('forgot',{'output':'invalid email'});
   }

   const otp = Math.floor(100000 + Math.random() * 900000);

   const[otp_data]=await con.query('SELECT * FROM tbl_otp WHERE email=?',[email]);
   const otp_detail = otp_data[0];

   const current_time=new Date();
   const expiry_time=new Date(current_time.getTime()+10 * 60000);

   if(otp_detail.length==0){
    console.log(otp_detail.length);

     await con.query("INSERT INTO `tbl_otp`(`email`, `otp_code`,`expire_at`) VALUES (?,?,?)",[email,otp,expiry_time]);
     console.log ("data insert");

   }else{
    console.log(otp_detail.length);

    await con.query("UPDATE `tbl_otp` SET `otp_code`=?,`expire_at`=? WHERE `email`=?",[otp,expiry_time,email]);
    console.log ("data update");
   }

   

   await con.commit();

   sendOTPFornewPass(email,otp);
   console.log('user_email',email);

   res.render('otp',{
    output: '',
    email: email
  })



  }catch(error){
    await con.rollback();

    console.log(error)
    res.render('rj500')

  }

  

}

const otp_verify = async(req,res,next)=>{
  const con=await connection();
  const {email,otp}=req.body;
  console.log("body",req.body);

  try{
    await con.beginTransaction();
    const [verify_result] = await con.query('SELECT * FROM `tbl_otp` WHERE email=?',[email]);
    const verify_deatil= verify_result[0];
    console.log("dbotp",verify_deatil.otp_code);
      console.log("client",otp);
    if(verify_deatil.otp_code == otp){
      if(verify_deatil.expire_at > new Date()){

        console.log("otp verify")
        
      res.render('resset',{'output':'otp time out','email':email});

      }else{
      res.render('otp',{'output':'otp time out','email':email});

      }
      



      
    }else{
      res.render('otp',{'output':'invalide otp','email':email});
    }



    await con.commit();

  }catch(error){
    await con.rollback();
    console.log(error);

  }finally{
    await con.release();

  }

  
}

const resetpost = async(req,res,next)=>{

 const con = await connection();

 const {newpassword , confirm ,email} = req.body;
 console.log(req.body);
 if(newpassword != confirm){

  res.render('resset',{'output':'new password and confirm password doesnot match','email':email});


 }



 try{
  console.log(newpassword);
  console.log(confirm);

  

  const[update_password]= await con.query('UPDATE `tbl_user` SET `password`=? WHERE email=?',[newpassword,email]);
  
  res.render('login',{'output':'New password add Sucessfully','email':email});

  console.log('success')


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
const resset =async(req,res,next)=>{

  res.render('resset',{'output':''})



}

const otp = async(req,res,next)=>{
  res.render('otp',{'output':''});
}




  //--------------------- Export Start ------------------------------------------
export { home , login , login_post , regitation , regitation_post , forgot , forgotpost, otp,otp_verify, resset, resetpost, index ,indexpost, about , games, blog, contact , privacypolicy , termscondition }


         
