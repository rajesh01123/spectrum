
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';

import upload from '../middleware/upload.js';


import {hashPassword, comparePassword, sendWelcomeMsg , responsetoQuery , sendOTPFornewPass ,sendNotification} from '../middleware/helper.js'
import { response } from 'express';
import { userInfo } from 'os';
import { error } from 'console';

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
    
  } finally{
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






//---------------------  view User  start  ------------------------------------------



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

    

  }catch(error){

    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


  }

}

const viewUserPost= async(req,res,next)=>{

  const con = await connection();
  console.log(req.body);
  const {u_id , user_name, email, contact, address, gender , state, birthday_date} =req.body;
  // console.log(gender);
  
  
  try{

    var userdata = {"user_name":user_name, "email":email, "contact":contact, "address":address, "gender":gender, "state":state , "birthday_date":birthday_date};
    const [result] = await con.query('UPDATE tbl_user SET ? WHERE u_id = ?', [userdata, u_id]);
    res.redirect('/admin/viewUsers')
  

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
//--------------------- end  user   ------------------------------------------


//--------------------- event  add  start  ------------------------------------------

const eventcategory =async(req,res,next)=>{

  res.render('eventcategory',{'output':'Please Add eventes'});

}



const eventcat_post =async(req,res,next)=>{

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
  res.render('eventcategory',{'output':' That name event category allready exits'});
     
    }else{
   await con.query('INSERT INTO `tbl_event_category`(`name`, `image`) VALUES (?,?)',[name,image]);
  res.render('eventcategory',{'output':'eventcategory add successfully'});
    
    }


  }catch(error){
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});


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


const editevent = async(req,res,next)=>{
  const con = await connection();
  const eventcatID= req.query.eventcatID;
  console.log(eventcatID);
  try{

    const [eventcat_data] =await con.query('SELECT * FROM `tbl_event_category` WHERE id=?',[eventcatID]);
    const eventcatdata= eventcat_data[0];
    console.log(eventcatdata);
    
    res.render('edit_event',{'eventcatdata':eventcatdata,'output': 'data fetch successfully'});
    

    
  }catch(error){

    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }







}

const edit_event_post=async(req,res,next)=>{
  const con = await connection();
  // console.log(req.body);
  const {eid, name}=req.body;
  var  image = req.file.filename;
  if(!image){

    const [dbe_cat_data] =await con.query('SELECT * FROM `tbl_event_category` WHERE id=?',[eid]);
    const e_cat_data = dbe_cat_data[0];
    var image = e_cat_data.image;

  }
  console.log('update event name',name);
  console.log(' event id',eid);
  console.log('update image',image);






  try{
    await con.beginTransaction();

    await con.query('UPDATE `tbl_event_category` SET `name`=?,`image`=? WHERE id=?',[name,image,eid]);
    await con.commit();
    const [eventcat] =await con.query('SELECT * FROM `tbl_event_category`');
    
    res.render('vieweventcat',{"eventcat":eventcat,'output':name+''+'eventcategory Update successfully'});

  }catch(error){
    await con.rollback();
    console.log(error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

  }finally{
    await con.release();
  }
}

 const deletevent = async(req,res,next)=>{
  const con = await connection();
  
  const eventID= req.body.eventID;

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







//--------------------- event  end  ------------------------------------------



//--------------------- match add and ------------------------------------------



const addmatch = async(req,res,next)=>{
  
  try{
  res.render('admin/addmatch',{'output':''});
  
  }catch(error){
    console.log(error);
  }
  

  
}

const addmatch_post = async(req,res,next)=>{
  const con =await connection();
  const {sport_name, match_id, match_name, team_name1, team_name2, match_type, date, time}=req.body;
  
  try{
    await con.beginTransaction();

    await con.query("INSERT INTO `tbl_match`(`match_id`, `sport_name`, `match_name`, `match_type`, `team_name1`, `team_name2`, `match_date`, `match_time`) VALUES (?,?,?,?,?,?,?,?)", [match_id,sport_name,match_name,match_type,team_name1,team_name2, date,time]);

    await con.commit();

    res.render('admin/addmatch',{'output':'match add success full'});

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

    const[matchs]=await con.query('SELECT * FROM tbl_match');




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

    await con.query('DELETE FROM `tbl_match` WHERE id =?',[match_id]);

    await con.commit();

    const[matchs]=con.query('SELECT * FROM tbl_match');
    res.render('admin/viewmatch',{'matchs':matchs,'output':'user deleted'});


  }catch(error){
     await con.rollback();
    res.render('admin/kilvish500', {'output':'Internal Server Error'});

    console.log(error);

  }finally{
     con.release();
  }


}
//--------------------- match add and ------------------------------------------







//--------------------- Export Start ------------------------------------------
export { homePage, loginPage , loginAdmin , logout , Profile , ProfilePost , updateadminpic , changepass , viewUsers ,viewUser , viewUserPost , deletuser , addmatch , addmatch_post , viewmatch , deletematch , eventcategory , eventcat_post , editevent , vieweventcat , edit_event_post, deletevent}


         
