
import { query } from 'express';
import connection from '../config.js';
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import { sendOTPFornewPass } from '../middleware/helper.js'






const home = async(req,res,next)=>{

  res.redirect('/admin')


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

      res.render('login',{'output':'user password wrong'});
    
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

  console.log(req.body);

  const { username, email, contact, password, gender, address, state, birthday } = req.body;

  const upgrade_address = JSON.stringify(address);
  
  try {

    await con.beginTransaction();

    const[u_email] = await con.query('SELECT * FROM `tbl_user` WHERE `email`=?',[email]);

    const[u_contact] = await con.query('SELECT * FROM `tbl_user` WHERE `contact`=?',[contact]);


    if(u_email.length !=0){

    res.render('regitation',{'output':'Please Enter Unique Email '});
        
    }else if(u_contact.length!=0){

    res.render('regitation',{'output':'Please Enter Unique contact Number '});

    }else{
    
    
      
    await con.query(

      "INSERT INTO `tbl_user` (`user_name`, `email`, `contact`, `password`, `address`, `gender`, `birthday_date`, `state`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
      
      [username, email, contact, password, upgrade_address, gender, birthday, state]

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

   console.log(data);

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

     con.release();

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

       

        






  //--------------------- Export Start ------------------------------------------
export { home , login , login_post , regitation , regitation_post , forgot , forgotpost, otp,otp_verify, resset, resetpost, index ,indexpost, about , games, blog, contactpage , privacypolicy , termscondition }


         
