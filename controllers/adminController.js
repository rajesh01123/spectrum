
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';

import upload from '../middleware/upload.js';


import {hashPassword, comparePassword, sendWelcomeMsg , responsetoQuery , sendOTPFornewPass ,sendNotification} from '../middleware/helper.js'
import { response } from 'express';
import { userInfo } from 'os';
import { error } from 'console';
// import { output } from 'pdfkit';

// import { id } from 'date-fns/locale';


//-------------------- Home page  ------------------------------ 


const homePage = async(req,res,next)=>{ 

  const con = await connection();

  try {
    await con.beginTransaction();
   
    var Data = { };
    

    con.commit()
    res.render('admin/index',{Data}) 

  } catch (error) {
    await con.rollback()
    console.log(error.message)
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
    
  }finally{
     con.release();
  }

}


//--------------------  Login/ logout Start -------------------------------


const loginPage = async(req,res,next)=>{    
      if(!req.admin) {
        console.log("Admin's Session expired")
        res.render('admin/login',{'output':''}) 
    }
    else{
        console.log("Admin session exists")
        res.redirect('/admin')
    }
    //res.render('admin/login',{'output':''}) 
}


const loginAdmin = async (req,res,next)=>{     

  console.log(req.body)
  const con = await connection();  

  const {username,password} = req.body; 
  //if user don't enter email password
  if(!username || !password){    
      // res.json("Please Enter Email and Password")
       res.render('admin/login',{'output':'Please Enter Username and Password'})
       console.log('Enter data');
      
  }
  else 
  {

      const [results] = await con.query('SELECT * FROM tbl_admin WHERE username = ?', [username]);                 
      const admin = results[0];    

       if(!admin){                
         //res.json("Invalid Email & Password")  
        res.render('admin/login',{'output':'Invalid Username'})         
          }
           else if (admin.password != password) {
                        
           res.render('admin/login',{'output':'Incorrect Password'})   
          }
          else {             
           sendTokenAdmin(admin,200,res)
           }  
   
 
  }    
}


const logout = async(req,res,next)=>{    

  res.cookie("Admin_token",null,{
    expires : new Date(Date.now()),
    httpOnly:true
})

res.render('admin/login',{'output':'Logged Out !!'}) 

}


//--------------------- change and reset password --------------------





//--------------------- end change and reset password --------------------






//---------------------- Admin Profile  view/edit ----------------------


const Profile= async(req,res,next)=>{    

  try {
    var admin = req.admin;
    res.render('admin/profile',{'admin':admin,"output":""})
    
  } catch (error) {
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  }
    
 
}


const ProfilePost= async(req,res,next)=>{    
  
  const con = await connection(); 
try {

  var image =  req.admin.image
  var imagePath=  req.admin.imagePath 
 if (req.file) {
   image =  req.file.filename ;
   imagePath=  req.file.path ;   

   console.log(image);
}

console.log(image)
var uDetails = req.body; 
var userdata = {"firstname":uDetails.firstname,"lastname":uDetails.lastname,"email":uDetails.email,"username":uDetails.username,"contact":uDetails.contact, "image":image ,"imagePath":imagePath , "address":req.body.address};
 await con.query('UPDATE tbl_admin SET ? WHERE id = ?', [userdata, req.admin.id]);

const [[admin]] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [req.admin.id]);

console.log(admin)
res.render('admin/profile',{'admin':admin,"output":" Profile Updated Successfully !!"})
  
} catch (error) {
  const [[admin]] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [req.admin.id]);

  res.render('admin/profile',{'admin':admin,"output":"Failed to  Updated Profile !!"})
  
}finally {
  con.release(); 
}
    
}






const updateadminpic = async(req,res,next)=>{ 
  const con = await connection();  
 
  
  try {
    await con.beginTransaction();




    var image =  req.admin.image
  var imagePath=  req.admin.imagePath 
 if (req.file) {
   image =  req.file.filename ;
   imagePath=  req.file.path ;   
}
 await con.query('UPDATE tbl_admin SET image = ?, imagePath = ? WHERE id = ?', [image, imagePath, req.admin.id]);
 await con.commit();
    res.json({msg:"success"})    
  } catch (error) {
    await con.rollback();
    console.log("failed to update profile pic --> ",error)
    res.json({msg:"failed"})
  }finally {
    con.release(); 
  }

 
}


//----------------------- change Pass word -------------- 



const changepass = async (req, res, next) => {
  const con = await connection();

  try {
  
    
    const existingPass = req.admin.password;
  
    const { opass, npass, cpass } = req.body;

    if (opass !== existingPass) {    
      return res.render('admin/profile',{"output":"Old password is incorrect"})
    }
    if (npass !== cpass) {
     return res.render('admin/profile',{"output":"New password and confirm password do not match"})
     
    }
   
    res.render('admin/profile',{"output":"Password changed successfully"})
    await con.query('UPDATE tbl_admin SET password = ? WHERE id = ?', [cpass,req.admin.id]);

   
  } catch (error) {
    console.error('Error:', error);
    res.render('admin/profile',{"output":"failed to Update Password "})
  }finally {
    con.release(); 
  }
};

//---------------------  end password  ------------------------------------------

const forgotpassword = async(req,res,next)=>{
  const con= await connection();
  res.render('forgotpassword',{
    showForgotPasswordForm:true,
    showverifyotp:false,
    showresetpassword:false,
    login:false,
    'output':"Enter youer Email"


  });

}
const  sendotp = async(req,res,next)=>{
  const con = await connection();
  console.log(req.body);
  const email =req.body.email;
  try{
    await con.beginTransaction();

    const[isAdmin] = await con.query("SELECT * FROM tbl_admin WHERE email=?",[email]);
    if(isAdmin.length==0){
      res.render('forgotpassword',{
        showForgotPasswordForm:true,
        showverifyotp:false,
        showresetpassword:false,
        login:false,
        'output':"invalid email",

      });
    }

    // const otp = Math.floor(100000 + Math.random()+900000);
    const otp = Math.floor(100000 + Math.random() * 900000); 
    const currentTime = new Date();
    const expirestime =new Date(currentTime.getTime()+10 * 60000);

    const [results]=await con.query("SELECT * FROM tbl_otp WHERE email=?",[email]);
    if(results.length==0){
      await con.query('INSERT INTO `tbl_otp`(`email`,`otp_code`,`expire_at`) VALUES (?,?,?)',[email,otp,expirestime]);


    }else{
      await con.query('UPDATE tbl_otp SET otp_code=? , expire_at=? WHERE email=?',[otp,expirestime,email]);

    }

    await con.commit();

    sendOTPFornewPass(email,otp);

    res.render('forgotpassword',{
      showForgotPasswordForm:false,
      showverifyotp:true,
      showresetpassword:false,
      login:false,
      'output':"! OTP Send",
      email: email
    })

  }catch(error){
    con.rollback();
    console.log('error',error);
    res.render('forgotpassword',{
      showForgotPasswordForm:true,
      showverifyotp:false,
      showresetpassword:false,
      login:false,
      'output':"Internal Server Error"})

  }finally{
    con.release();
  }

}


const otpverify = async(req,res,next)=>{
  const con = await connection();
  console.log(req.body)
  const email=req.body.verifyEmail;
  const otp=req.body.otp;

  try{
    await con.beginTransaction();
    const [results]=await con.query('SELECT * FROM `tbl_otp` WHERE email=?',[email]);
    const otp_data=results[0];
    console.log('dbotp',otp_data.otp_code);
    console.log('userotp',otp);
    if(otp_data.otp_code==otp){

      res.render('forgotpassword',{
        showForgotPasswordForm:false,
        showverifyotp:false,
        showresetpassword:true,
        login:false,
        'output':"!Enter new password And confirm Password",
        email: email
      });


    }else{

      
      res.render('forgotpassword',{
        showForgotPasswordForm:false,
        showverifyotp:true,
        showresetpassword:false,
        login:false,
        'output':"otp expire",
        email: email
      });

    }



    await con.commit();
  }catch(error){

    con.rollback();
    console.log('error',error);
    res.render('forgotpassword',{
      showForgotPasswordForm:false,
      showverifyotp:true,
      showresetpassword:false,
      login:false,
      'output':"Internal Server Error",
      email: email

    });

   
  }finally{
    con.release();
  }

}

const resetpassword = async(req,res,next)=>{
  const con = await connection();
  console.log(req.body);
  const {npass,cpass,email}= req.body;
  
  try{
    await con.beginTransaction();
    if(npass!=cpass){

      res.render('forgotpassword',{
        showForgotPasswordForm:false,
        showverifyotp:false,
        showresetpassword:true,
        login:false,
        'output':"!New password and confirm password do not match",
        email: email
      })
  
    }else{

      await con.query('UPDATE `tbl_admin` SET `password`=? WHERE email=?',[cpass,email]);

      // res.render('login',{'output':'Password Reset Success !'});

      res.render('forgotpassword',{
        showForgotPasswordForm:false,
        showverifyotp:false,
        showresetpassword:false,
        login:true,
        'output':"Password Reset Success please login!",
        }
      );


    }

  
    await con.commit();
  }catch(error){
    con.rollback();
    console.log('error',error);
    res.render('forgotpassword',{
      showForgotPasswordForm:false,
      showverifyotp:false,
      showresetpassword:true,
      login:false,
      'output':"Internal Server Error",
      email: email }
    );
  
  }finally{
    con.release();
  }
  }






//---------------------  view User  start  ------------------------------------------
const addUser = async(req, res, next) => {
    res.render('admin/addUser' , {'output':''});
}


const viewUsers = async(req, res, next) => {
  const con =await connection();
   try{
    const[users]= await con.query('SELECT * FROM tbl_user');
    res.render('admin/viewUsers' , {'users':users,'output':'data fetched success fully'});


   }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


   }


}



const viewUser = async(req ,res,next) =>{
  const con = await connection();

  try{
    var userid= req.query.userID;
    const[[userInfo]]= await con.query('SELECT * FROM tbl_user WHERE u_id=?', [userid]);

    res.render('admin/viewUser',{'user':userInfo, 'output': 'user info fatched'});
    // console.log(userInfo);

    

  }catch(error){

    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }

}

const viewUserPost= async(req,res,next)=>{

  const con = await connection();
  // console.log("bodydata",req.body);
  const {userID,name, email, contact,address, gender , state, birthday_date,disability} =req.body;
  
  if (req.file) {

    const image =  req.file.filename ;
    console.log("file name",image);
    const imagePath=  req.file.path ;  
    var userdata = {"user_name":name, "email":email, "contact":contact, "address":address, "gender":gender, "state":state , "birthday_date":birthday_date,"document":image,"disability":disability};

  }else{
    var userdata = {"user_name":name, "email":email, "contact":contact, "address":address, "gender":gender, "state":state , "birthday_date":birthday_date,"disability":disability};
  }
   
  
  
  try{
    

    
    const [result] = await con.query('UPDATE tbl_user SET ? WHERE u_id = ?', [userdata, userID]);

    console.log('data update successfully');

  const[users]= await con.query('SELECT * FROM tbl_user');


    res.render('admin/viewUsers', {'users':users,'output':'detail update sucessfully'});
  

  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }

}

const deletuser= async(req,res,next)=>{
  const con = await connection();
  const userID= req.body.userID;
  console.log(userID)

  try{
    await con.beginTransaction();

     

    //  await con.query('DELETE FROM tbl_prop WHERE user_id =? ',[userID]);

     await con.query('DELETE FROM tbl_user WHERE u_id = ?',[userID]);

     var[user]= await con.query('SELECT * FROM tbl_user');
     console.log("delete user",userID)

     await con.commit();

     res.status(200).json({ msg:true });


  }catch(error){
     await con.rollback();

     console.log(error);

     var[user]= await con.query('SELECT * FROM tbl_users');
     console.log('error');


     res.status(200).json({ msg:false });
     


  }finally{
    con.release();
  }

}

 const adduserpost =async(req,res,next)=>{
  const con = await connection();
  console.log(req.body);
  if (req.file) {
   const image =  req.file.filename ;
   const imagePath=  req.file.path ;   
 }

  console.log( req.file.filename);


  try{
    

  const { name, email, contact, password ,address, gender , state, birthday_date,disability} =req.body;
  await con.query('INSERT INTO `tbl_user`(`user_name`, `email`, `contact`, `password`, `address`, `gender`, `birthday_date`, `state`, `document`, `disability`) VALUES ( ?,?,?,?,?,?,?,?,?,? )',[name,email,contact,password,address,gender,birthday_date,state,req.file.filename,disability]);
  
  res.render('admin/addUser',{'output':'User add Successfully'});

    

  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }

 }
//--------------------- end  user   ------------------------------------------


//--------------------- event  add  start  ------------------------------------------

const addevent =async(req,res,next)=>{

  const con = await connection();
  try{
    
    const [event_type]= await con.query('SELECT * FROM `tbl_event_category`');

  

  res.render('addevent',{'event_type':event_type,'output':'Please Add Games Eventes'});

  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }

}

const viewevent = async(req,res,next)=>{

  const con = await connection();

  try{
    const [event] =await con.query('SELECT * FROM `tbl_event`');
    
  res.render('viewevent',{"event":event,'output':'eventcategory fetched successfully'});



  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }




}


const event=async(req,res,next)=>{
  const con= await connection();
  console.log(req.body);
  
  const{event_type,participants,date,start_time,end_time,venue_name,venue_location,description,title,rules}=req.body;





  try{
    await con.beginTransaction();
   
    await con.query('INSERT INTO `tbl_event`( `event_type`, `participants`, `date`, `start_time`, `end_time`, `venue_name`, `venue_location`, `description`,`title`,`rules`) VALUES ( ?,?,?,?,?,?,?,?,?,? )',[event_type,participants,date,start_time,end_time,venue_name,venue_location,description,title,rules]);
  
    const [event_types]= await con.query('SELECT * FROM `tbl_event_category`');

    console.log('event add succees full')
  
    res.render('admin/addevent',{'event_type':event_types,'output':'Games Event add successfully'});
  
   await con.commit();
  }catch(error){
    await con.rollback();
  console.log(error);
  res.render('admin/kilvish500', {'output':'Internal Server Error'});
  
  }finally{
    con.release();
  }
  
  


}


const deletevent = async(req,res,next)=>{
  const con = await connection();
  
  const eventID= req.body.eventId;

  try{

    await con.query('DELETE FROM `tbl_event` WHERE id=?',[eventID]);

    console.log("event delete id of event ",eventID);

    await con.commit();

    res.status(200).json({ msg:true });


  }catch(error){
    
    res.status(200).json({ msg:false });
    console.log(error);

 
 }
}


const editevent = async(req,res,next)=>{
  const con = await connection();
  const eventID= req.query.eventID;
  console.log("event edite id ",eventID);
  try{

    const [eventcat_data] =await con.query('SELECT * FROM `tbl_event` WHERE id=?',[eventID]);
    const eventdata= eventcat_data[0];
    console.log(eventdata);

    const [event_type]= await con.query('SELECT * FROM `tbl_event_category`');

    
    res.render('edit_event',{'eventdata':eventdata,'event_type':event_type,'output': 'data fetch successfully'});
    

    
  }catch(error){

    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }







}
const edit_event_post = async(req,res,next)=>{
  const con = await connection();
  const {event_id,event_type,participants,date,start_time,end_time,venue_name,venue_location,description,title,rules}=req.body;



  try{

    await con.query('UPDATE `tbl_event` SET `event_type`=?,`participants`=?,`date`=?,`start_time`=?,`end_time`=?,`venue_name`=?,`venue_location`=?,`description`=?,title=?,rules=? WHERE `id`=?',[event_type,participants,date,start_time,end_time,venue_name,venue_location,description,title,rules,event_id]);

    const [event] =await con.query('SELECT * FROM `tbl_event` ');
    
  res.render('viewevent',{"event":event,'output':'event Update successfully'});

  // console.log('event update success fully',participants);




  }catch(error){

    await con.rollback();
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }

}


// const eventtype =async(req,res,next)=>{

//   res.render('eventtype',{'output':''});

// }



 const getevent_name = async(req,res,next)=>{

  const con = await connection();
  try{
    const[eventNames]=await con.query('SELECT * FROM `tbl_event_category`');
   res.render('addevent_name',{'event_type':eventNames,'output':''});
  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }

 }






const addevent_name =async(req,res,next)=>{

  const con =await connection();
  // console.log(req.body);

  try{




    const{name}=req.body;
    var  image =req.file.filename


    if (req.file) {
      image =  req.file.filename ;
     const imagePath=  req.file.path ;  
      console.log(imagePath);
   
     
   }

    const[ucat_name]= await con.query('SELECT * FROM `tbl_event_category` WHERE `name`=?',[name]);

    if(ucat_name.length !=0){

      const [event_type]= await con.query('SELECT * FROM `tbl_event_category`');
      console.log('event type',event_type);
      

   res.render('addevent_name',{'event_type':event_type,'output':'That name event category allready exits'});
  
     
    }else{
   await con.query('INSERT INTO `tbl_event_category`(`name`, `image`) VALUES (?,?)',[name,image]);

   const [event_type]= await con.query('SELECT * FROM `tbl_event_category`');

   console.log('event type',event_type);

   res.render('addevent_name',{'event_type':event_type,'output':'Event name add successfully'});

  
    
    }


  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }


}

const deletevent_name = async(req,res,next)=>{
  const con = await connection();

  console.log(req.body);
  
  const eventID= req.body.e_nameId;

  try{

    await con.query('DELETE FROM `tbl_event_category` WHERE id=?',[eventID]);

    console.log("event delete id of event ",eventID);

    await con.commit();

    res.status(200).json({ msg:true });


  }catch(error){
    
    res.status(200).json({ msg:false });
    console.log(error);

 
 }
}





const vieweventcat =async(req,res,next)=>{

  const con = await connection();

  try{
    const [eventcat] =await con.query('SELECT * FROM `tbl_event_category`');
    
  res.render('vieweventcat',{"eventcat":eventcat,'output':'eventcategory fetched successfully'});



  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }

}







// const edit_event_post=async(req,res,next)=>{
//   const con = await connection();
//   // console.log(req.body);
//   const {eid, name}=req.body;
//   var  image = req.file.filename;
//   if(!image){

//     const [dbe_cat_data] =await con.query('SELECT * FROM `tbl_event_category` WHERE id=?',[eid]);
//     const e_cat_data = dbe_cat_data[0];
//     var image = e_cat_data.image;

//   }
//   console.log('update event name',name);
//   console.log(' event id',eid);
//   console.log('update image',image);






//   try{
//     await con.beginTransaction();

//     await con.query('UPDATE `tbl_event_category` SET `name`=?,`image`=? WHERE id=?',[name,image,eid]);
//     await con.commit();
//     const [eventcat] =await con.query('SELECT * FROM `tbl_event_category`');
    
//     res.render('vieweventcat',{"eventcat":eventcat,'output':name+''+'eventcategory Update successfully'});

//   }catch(error){
//     await con.rollback();
//     console.log(error);
//     res.render('admin/kilvish500', {'output':'Internal Server Error'});

//   }finally{
//       con.release();
//   }
// }

 







//--------------------- event  end  ------------------------------------------



//--------------------- match add and ------------------------------------------



const addgame = async(req,res,next)=>{
  
  try{
  res.render('admin/addgame',{'output':''});
  
  }catch(error){
    console.log(error);
  }
  

  
}

const addgame_post = async(req,res,next)=>{
  const con =await connection();
  const {name,max_player,min_player,play_time,description}=req.body;
  
  try{
    await con.beginTransaction();

    await con.query('INSERT INTO `tbl_game`(`name`, `max_player`, `min_player`, `play_time`, `Description`) VALUES ( ?,?,?,?,? )',[name,max_player,min_player,play_time,description]);

    // await con.query("INSERT INTO `tbl_match`(`name`, `sport_name`, `match_name`, `match_type`, `team_name1`, `team_name2`, `match_date`, `match_time`) VALUES (?,?,?,?,?,?,?,?)", [match_id,sport_name,match_name,match_type,team_name1,team_name2, date,time]);

    await con.commit();

    res.render('admin/addgame',{'output':'match add success full'});

  }catch(error){
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
    console.log(error);

  }finally{
    con.release();

  }


}

const viewmatch = async(req,res,next)=>{

  const con =await connection();

  try{
    await con.beginTransaction();

    const[matchs]=await con.query('SELECT * FROM tbl_game');




    await con.commit();
    res.render('admin/viewmatch',{'matchs':matchs,'output':'data fetched'});

  }catch(error){
    await con.rollback();
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
    console.log(error);

  }finally{
    con.release();
  }


}

const deletematch = async(req,res, next)=>{
  const con = await con.connection();
  const match_id =req.body.matchID;
  try{
     await con.beginTransaction();

    await con.query('DELETE FROM `tbl_game` WHERE id =?',[match_id]);

    await con.commit();

    const[matchs]=con.query('SELECT * FROM tbl_game');
    res.render('admin/viewmatch',{'matchs':matchs,'output':'user deleted'});


  }catch(error){
     await con.rollback();
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

    console.log(error);

  }finally{
     con.release();
  }


}

 const edite_match = async(req,res,next)=>{
  const con = await connection();
  const m_id=req.query.match_id;
  console.log('match_id',m_id);
  try{
    const[matchs]= await con.query('SELECT * FROM tbl_game WHERE id=?',[m_id]);
    console.log("game data",matchs[0].name);
    res.render('admin/editmatch',{'matchs':matchs[0],'output': 'matchs data fetch successfully'});
    


  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }
 }

  const edit_game_post=async(req,res,next)=>{
  const con = await connection();
  const {e_id,name,max_player,min_player,play_time,description}=req.body;
  try{
    await con.query('UPDATE `tbl_game` SET `name`=?,`max_player`=?,`min_player`=?,`play_time`=?,`Description`=? WHERE id=?',[name,max_player,min_player,play_time,description,e_id]);
    console.log('data update success fully')
   
    const[matchs]=await con.query('SELECT * FROM tbl_game');




    await con.commit();
    res.render('admin/viewmatch',{'matchs':matchs,'output':'data update successpully'});
   

  }catch (error){

  }

 }
//--------------------- match add and ------------------------------------------






// const notify = async(req,res, next)=>{
//   res.render('admin/notify', {'output':''});
// }

//---------------------------Terms & Conditions-------------------------


const tandc = async(req,res, next)=>{
  const con =await connection();

  try{
    
    const[term_data]= await con.query('SELECT * FROM `tbl_termsconditions`');
   

    res.render('admin/tandc', {'term_data':term_data,'output':''});

  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }
  
}
const TermsConditions = async(req,res,next)=>{

  const con = await connection();
  console.log(req.body);
  const  {eventDescription} = req.body;

  const dbevent=JSON.stringify.eventDescription;
  console.log('event',eventDescription);

  try{
    await con.beginTransaction();

    await con.query('INSERT INTO `tbl_termsconditions`(`eventDescription`) VALUES (?)',[eventDescription]);

    await con.commit();
    const[term_data]= await con.query('SELECT * FROM `tbl_termsconditions`');
   
 
    res.render('admin/tandc', {'term_data':term_data,'output':'Terms & conditions Add Successfully'});

  }catch(error){
    await con.rollback();
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }finally{
     con.release();
  }

}

const deletTerm = async(req,res,next)=>{
  const con = await connection();
  
  const termID= req.body.termID;

  try{

    await con.query('DELETE FROM `tbl_termsconditions` WHERE id=?',[termID]);

    console.log("termsconditions delete id of TERM ",termID);

    await con.commit();

    res.status(200).json({ msg:true });


  }catch(error){
    
    res.status(200).json({ msg:false });
    console.log(error);

 
 }
}


// ------------------------------privacy policy-----------------------

const pandp = async(req,res, next)=>{

  try{
    
    const[privacy_data]= await con.query('SELECT * FROM `tbl_privacypolicy`');
    res.render('admin/pandp', {'privacy_data':privacy_data,'output':'Privacy & Policy fetched Successfully'});
    console.log('fetch data',privacy_data);
  
   
  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  
  
  }


 
}

const privacyPolicy =async(req,res,next)=>{
  const con = await connection();
  console.log(req.body);
  const  {description} = req.body;
  try{
    await con.beginTransaction();
    await con.query('INSERT INTO `tbl_privacypolicy`(`description`) VALUES (?)',[description]);

   await con.commit();
   const[privacy_data]= await con.query('SELECT * FROM `tbl_privacypolicy`');
    res.render('admin/pandp', {'privacy_data':privacy_data,'output':'Privacy & Policy Add Successfully'});
  }catch(error){
    await con.rollback();
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }finally{
    con.release();
  }




}


// try{
//   await con.beginTransaction();

//  await con.commit();
// }catch(error){
//   await con.rollback();
// console.log(error);
// res.render('admin/kilvish500', {'output':'Internal Server Error'});

// }finally{
//   con.release();
// }


const deleteprivacy = async(req,res,next)=>{
  const con = await connection();
  const privacy_id=req.body.privacyID;
  console.log(privacy_id);
 
try{
  await con.beginTransaction();
  await con.query('DELETE  FROM tbl_privacypolicy WHERE id=?',[privacy_id]);
  res.status(200).json({ msg:true });
  await con.commit();
  console.log("privacy delete",privacy_id);


}catch(error){
  await con.rollback();
  console.log('delete time error',error);

  res.status(200).json({ msg:false });

  
}



}

const notify = async(req,res,next)=>{
  const con = await connection();
  try{
    const [notify_data] = await con.query('SELECT * FROM tbl_notification ORDER BY id DESC');
    const[user_data]= await con.query('SELECT * FROM tbl_user');
    // const  send_notify = notify_data.users;
    // console.log('send_notify', notify_data.users);

    
    



    res.render('admin/notify',{'notify_data':notify_data,'user_data':user_data,'output':'data fetched successfully'});
}catch(error){
  console.log(error);
  res.render('admin/kilvish500', {'output':'Internal Server Error'});

}

}

const notifypost = async(req,res,next)=>{

  const con = await connection();
  console.log(req.body);
  const {title,message}=req.body;
  const users = req.body['users'];
  console.log('user',users);

  const usersString = Array.isArray(users) ? users.join(',') : users;
  console.log(usersString);



  try{
    await con.beginTransaction();

    

    await con.query('INSERT INTO tbl_notification (`users`, `title`, `message`) VALUES ( ?, ?, ? )', [usersString, title, message]);


    const[notify_data]= await con.query('SELECT * FROM tbl_notification');
    const[user_data]= await con.query('SELECT * FROM tbl_user');

    res.render('admin/notify',{'notify_data':notify_data,'user_data':user_data,'output':' notification add successfully'});

    sendNotification(users,message,title);



    await con.commit();

  }catch(error){
  console.log(error);
  res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }finally{
    con.release();

  }


}
  

const deletenotify = async(req,res,next)=>{

  const con =await connection();
  const notifyId = req.body.notifyId;
  console.log('notificati delete id',notifyId);
  try{
   await con.beginTransaction();

    await con.query('DELETE from tbl_notification WHERE id=?', [notifyId] );
    res.status(200).json({ msg:true });


   await con.commit();
  
  }catch(error){
    await con.rollback();
    console.log(error);
    res.status(200).json({ msg:false });



  }finally{
      con.release();
  }

}









//--------------------- Export Start ------------------------------------------
export { homePage, loginPage , loginAdmin , logout , Profile , ProfilePost , updateadminpic , changepass ,forgotpassword,sendotp,otpverify,resetpassword, addUser,  adduserpost, viewUsers ,viewUser , viewUserPost , deletuser , addgame , addgame_post , viewmatch ,edite_match , edit_game_post , deletematch  ,getevent_name, addevent_name ,deletevent_name, event,editevent , vieweventcat , edit_event_post, deletevent, pandp, notify,tandc,TermsConditions,deletTerm,privacyPolicy,deleteprivacy,addevent, viewevent,notifypost,deletenotify, }


         

