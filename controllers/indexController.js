
import { query } from 'express';
import connection from '../config.js';
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import { sendOTPFornewPass } from '../middleware/helper.js';
import upload from '../middleware/upload.js';
import dotenv from 'dotenv' 



dotenv.config({path:"./config.env"});

import Razorpay from 'razorpay'

import crypto from 'crypto'



import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


const { key_id, key_secret } = process.env;
const razorpay = new Razorpay({
  key_id: key_id, // Replace with actual key
  key_secret: key_secret, // Replace with actual secret
});

const options = {
  amount: 500000, // ₹500 in paise
  currency: "INR",
  receipt: "order_rcptid_" + Date.now(),
  payment_capture: 1, // Auto capture payment
};

// razorpay.orders.create(options)
//   .then(order => console.log("Order Created:", order))
//   .catch(error => console.error("Error Creating Order:", error));






const home = async(req,res,next)=>{

  res.redirect('/admin')


}

const dashboard= async(req,res,next)=>{
 
    const con = await connection();
    
    try{

       await con.beginTransaction();
       const Data='';

       const[event_cat]= await con.query('SELECT * FROM `tbl_event_category` ORDER BY `id` DESC');

       res.render('dashboard',{'event_cat':event_cat, Data });
    
    
      await con.commit();
    }catch(error){
      await con.rollback();
    console.log(error);
    res.render('shine500');
    }finally{
       con.release();
    
    }
    
    
}


const uviewevent= async(req,res,next)=>{
  
    const con = await connection();
    
    try{

       await con.beginTransaction()
       const event_type=req.query.event_type;
       const [event_data]= await con.query('SELECT * FROM `tbl_event` WHERE event_type=?',[event_type]);
       console.log('fetch data eventdata',event_data);
       res.render('uviewevent',{'event_data':event_data,'event_name':event_type});
    
    
      await con.commit();
    }catch(error){
      await con.rollback();
    console.log(error);
    res.render('shine500');
    }finally{
       con.release();
    
    }
    
    
    }


    const uviewevent_details = async(req,res,next)=>{
  
      const con = await connection();
      
      try{
  
         await con.beginTransaction();
         const event_deatil=req.query.event_deatil;
         const [event_data]= await con.query('SELECT * FROM `tbl_event` WHERE id=?',[event_deatil]);
        //  console.log('fetch details id eventdata',event_data[0]);
         res.render('uviewevent_details',{'event_data':event_data});
      
      
        await con.commit();
      }catch(error){
        await con.rollback();
      console.log(error);
      res.render('shine500');
      }finally{
         con.release();
      
      }
      
      
      }


  


const booking_history= async(req,res,next)=>{

  const con = await connection();
  const u_id =  req.user.u_id; // Ensure correct user ID
  console.log('user_id',u_id);
  try {
     
      const [booking_data] = await con.query(
          'SELECT * FROM `tbl_booking` WHERE `user_id`=? ORDER BY `id` DESC',[u_id]
      );
      const data=booking_data[0];
      // console.log('Bookingsingle Data:', data);
       
      // console.log('Booking Data:', booking_data);
      const Data ='';
      
      res.render('booking_history', {
          'booking_data': booking_data,
          Data,
          'output': 'User event booking successful'
        
      });

  } catch (error) {
     
      console.log(error);
      res.render('shine500');
  } 
  
}


const index = async(req,res,next)=>{

  res.render('index', {'output':''})
  

}

// ---------------------------------- user side get page ---------------------------------------//

const about = async(req,res,next)=>{
  res.render('about')

}

const games = async(req,res,next)=>{
  res.render('games') 
}

const blog = async(req,res,next)=>{
  res.render('blog') 


}

const contactpage = async(req,res,next)=>{

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





const login = async (req,res,next)=>{

  res.render('login',{'output':''});

}

const regitation=async(req,res,next) =>{
  res.render('regitation',{'output':''});

}

const forgot = async(req,res,next)=>{

  res.render('forgot',{'output':''})

}

const uterm =async(req,res, next)=>{


  const con =await connection();

  try{
    
    const[term_data]= await con.query('SELECT * FROM `tbl_termsconditions`');
   

    res.render('uterm', {'term_data':term_data,'output':''});

  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }

  


}
const uprivacy =async(req,res, next)=>{


  const con =await connection();

  try{
    
    const[privacy_data]= await con.query('SELECT * FROM `tbl_privacypolicy`');
   

    res.render('uprivacy', {'privacy_data':privacy_data,'output':''});

  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }

  


}

// const  booking_history = async(req,res,next)=>{

// }

// ---------------------------------- End user side get pages ---------------------------------------//


// ---------------------------------- login  pages ---------------------------------------//




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

      res.render('login',{'output':'wrong_password'});
    
    }else{

      sendTokenUser(user,200,res);

      console.log('success')
    }

  }catch(error){

    console.log(error);

  }finally{

  con.release();
    
  }
  
}







const regitation_post = async (req, res, next) => {

  const con = await connection();

  // console.log(req.body);
  if (req.file) {
   const image =  req.file.filename ;
    const imagePath=  req.file.path ;   
 
    console.log(image);
 }

  const { username, email, contact, password, gender, address, state, birthday ,disability} = req.body;

  const upgrade_address = JSON.stringify(address);
  console.log(gender);
  
  try {

    await con.beginTransaction();

    const[u_email] = await con.query('SELECT * FROM `tbl_user` WHERE `email`=?',[email]);

    const[u_contact] = await con.query('SELECT * FROM `tbl_user` WHERE `contact`=?',[contact]);


    if(u_email.length !=0){

    res.render('regitation',{'output':'Please Enter Unique Email '});
        
    }else if(u_contact.length!=0){

    res.render('regitation',{'output':'Please Enter Unique contact Number '});

    }else{
      
    
   const image=req.file.filename
      
    await con.query(

      "INSERT INTO `tbl_user` (`user_name`, `email`, `contact`, `password`, `address`, `gender`, `birthday_date`, `state`,`document`,`disability`) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,? )", 
      
      [username, email, contact, password, upgrade_address, gender, birthday, state,image,disability,]

    );
    
    await con.commit();

    res.render('login', { output: 'User registration successful' });

  }
    
  } catch (error) {

    
    
    await con.rollback();

    res.render('admin/kilvish500', { output: 'Internal Server Error' });

    console.error(error);

  } finally {

    con.release(); 
}
}



const indexpost = async(req,res,next)=>{
  
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



const forgotpost = async(req,res,next)=>{

  const con =await connection();

  const {email}=req.body;

  console.log(email);

  try{

    await con.beginTransaction();

   const [data]= await con.query('SELECT * from tbl_user WHERE email=?',[email]);

   const user_detail=data[0];

  //  console.log(data);

   console.log(data.length);

   if(data.length == 0){

    res.render('forgot',{'output':'Oops! It seems the email address entered is not recognized. Please verify and re-enter'});
   
  }else{

   const otp = Math.floor(100000 + Math.random() * 900000);

   const[otp_data]=await con.query('SELECT * FROM tbl_otp WHERE email=?',[email]);

   const current_time=new Date();

   const expiry_time=new Date(current_time.getTime()+10 * 60000);

   if(otp_data.length==0){
   
    console.log('otp data',otp_data.length);



     await con.query("INSERT INTO `tbl_otp`(`email`, `otp_code`,`expire_at`) VALUES (?,?,?)",[email,otp,expiry_time]);
     console.log ("data insert");

   }else{
   
    console.log('otp data',otp_data.length);

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
}



  }catch(error){

    await con.rollback();

    console.log(error)

    res.render('rje500')

  }

  

}

const otp_verify = async(req,res,next)=>{

  const con=await connection();

  const {email,otp}=req.body;

  // console.log("body",req.body);


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

     con.release();

  }

  
}

const resetpost = async(req,res,next)=>{

 const con = await connection();

 const {newpassword , confirm ,email} = req.body;

 console.log(req.body);

 if(newpassword != confirm){

  res.render('resset',{'output':'New Password and Confirm Password Doesnot match','email':email});


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

//------------------------------- User profile----------------------//

const uprofile_get = async(req,res,next)=>{
  
 const  user_data = req.user;
 console.log('userdeatil');
  res.render('uprofile',{'output':'','user_data':user_data});



}

const uprofile_post =async(req,res,next)=>{

  const con = await connection();

  // console.log(req.body);

  const {u_id, user_name, email, contact, password, address, gender, birthday_date, state, disability}=req.body;

  

  try{

    await con.beginTransaction()
   
    await con.query('UPDATE tbl_user SET user_name= ? ,email= ? ,contact= ? ,address= ? ,gender= ? ,birthday_date= ? , state= ? , disability= ? WHERE u_id= ? ',[ user_name, email, contact, address, gender, birthday_date, state, disability , u_id ]);

    
 
   await con.commit();

    const [user_dataa]= await con.query('SELECT * FROM `tbl_user` WHERE u_id= ? ',[u_id] );
    const user_data=user_dataa[0];
    // console.log('userdaat',user_dataa);


  res.render('uprofile',{'user_data':user_data,'output':'user profile update successfully '});

 }catch(error){
   await con.rollback();
 console.log(error);
 res.render('shine500');
 }finally{
    con.release();
 
 }
}


const uchangepass = async (req, res, next) => {
  const con = await connection();

  try {
  
    
    const existingPass = req.user.password;

     const user_data =req.user;
  
    const { opass, npass, cpass } = req.body;

    if (opass !== existingPass) {    
      return res.render('uprofile',{'user_data':user_data, "output":"Old password is incorrect"})
    }
    if (npass !== cpass) {
     return res.render('uprofile',{ 'user_data':user_data, "output":"New password and confirm password do not match"})
     
    }
   
    res.render('uprofile',{'user_data':user_data, "output":"Password changed successfully"})
    await con.query('UPDATE tbl_user SET password = ? WHERE id = ?', [cpass,req.user.id]);

   
  } catch (error) {
    console.error('Error:', error);
    const user_data =req.user;
    res.render('uprofile',{'user_data':user_data, "output":"failed to Update Password "})
  }finally {
    con.release(); 
  }
};


// const ename = async(req,res,next)=>{
// const con = await connection();

// try{
//    await con.beginTransaction()


//   await con.commit();
// }catch(error){
//   await con.rollback();
// console.log(error);
// res.render('shine500');
// }finally{
//    con.release();

// }


// }


// </---------------------event registation--------------------------------\>


const event_ragitation = async(req,res,next)=>{

console.log('event registation');
const con = await connection();

try{
   await con.beginTransaction()

   res.render('event_regitation', {'output':''});
  await con.commit();
}catch(error){
  await con.rollback();
console.log(error);
res.render('shine500');
}finally{
   con.release();

}

}

// </------------------------|  payment detail   |-------------------


const payProduct = async (req, res, next) => {
  try {
    const { amount, currency } = req.body; // Amount in paise (e.g., ₹10 = 1000 paise)

    // console.log(" Received Payment Request");
    // console.log(" Amount:", amount);
    // console.log(" Currency:", currency || "INR");

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error(" Invalid amount:", amount);
      return res.status(400).json({ error: "Invalid amount. Please provide a valid amount in paise." });
    }

    const options = {
      amount: parseInt(amount), // Ensure it's an integer
      currency: currency || "INR",
      receipt: "order_rcptid_" + Date.now(),
      payment_capture: 1, // Auto capture payment
    };

    // console.log(" Order Options:", options);

    // Ensure Razorpay instance is initialized
    if (!razorpay) {
      console.error(" Razorpay instance is not initialized.");
      return res.status(500).json({ error: "Server error: Razorpay is not initialized." });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create(options); // Await the order creation
    // console.log(" Order Created:", order);

    res.json(order); // Return the order here
  } catch (error) {
    console.error(" Error Creating Order:", error);
    res.status(500).json({ error: error.message });
  }
};



const verify_payment = async (req, res, next) => {
  const con = await connection();
  try {
    console.log("🔍 Verifying Payment...");
    console.log("verfication data...",req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, event_name , event_type ,amount} = req.body;
    const {u_id, user_name, email} =req.user;
    // console.log('user details',req.user);
    // console.log('user id',u_id);

    

    

    console.log(" Received Data:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log(" Missing Payment Details");
      return res.status(400).json({ status: "failure", message: "Invalid payment details received" });
    }

    const key_secret = process.env.key_secret; //  Corrected
    console.log(" Razorpay Key Secret:", key_secret ? "Loaded" : " Missing");

    if (!key_secret) {
      return res.status(500).json({ status: "error", message: "Razorpay key secret is missing" });
    }

    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log(" Generated Signature:", generated_signature);
    console.log(" Received Signature:", razorpay_signature);

    if (generated_signature === razorpay_signature) {

      try {
        // Insert payment details into the database
        await con.query(
           "INSERT INTO `tbl_booking`(`user_id`,`user_name`, `email`, `payment`, `status`, `event_type`, `event_name`, `order_id`, `payment_id`) VALUES (?,?,?,?,?,?,?,?,?)",
            [u_id, user_name, email, amount, "success", event_type, event_name, razorpay_order_id, razorpay_payment_id]
        );

        // console.log("Payment Verified Successfully");
        // res.render('booking_history',{output:'payment success'});
        return res.json({
          status: "success",
          message: "Payment verified successfully",
          event_name,
          event_type
      });
    } catch (error) {
        console.error("Database Insertion Error:", error);
        return res.status(500).json({ status: "failure", message: "Database error" });
    }

      
      
    } else {
      console.log(" Payment Verification Failed");
      return res.status(400).json({ status: "failure", message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(" Error in Payment Verification:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


const book_pay = async (req, res, next) => {
  const con = await connection();
  const u_id = req.user.u_id; // Ensure correct user ID

  try {
     
      const [booking_data] = await con.query(
          'SELECT * FROM `tbl_booking` WHERE `user_id`=? ORDER BY `id` DESC',[u_id]
      );
      const data=booking_data[0];
      // console.log('Bookingsingle Data:', data);
       
      // console.log('Booking Data:', booking_data);

      
      res.render('booking_history', {
          'booking_data': booking_data,
          'output': 'User event booking successful'
      });

  } catch (error) {
     
      console.log(error);
      res.render('shine500');
  } 
};
  






// </------------------------|  payment detail   |-------------------















const logout = async(req,res,next)=>{    

  res.cookie("token",null,{
    expires : new Date(Date.now()),
    httpOnly:true
})

console.log('user logout')

res.render('login',{'output':'Logged Out !!'}) 

}



       

        






  //--------------------- Export Start ------------------------------------------
export { uprofile_get, uprofile_post , uchangepass , home , login , login_post , regitation , regitation_post , forgot , forgotpost, otp,otp_verify, resset, resetpost, index ,indexpost, about , games, blog, contactpage , privacypolicy , termscondition, dashboard,logout,uterm,uprivacy, uviewevent,uviewevent_details, booking_history, event_ragitation,payProduct,verify_payment ,book_pay
}

//,success,cancel


         
