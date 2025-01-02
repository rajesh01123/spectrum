

const index = async(req ,res,next)=>{

  res.render('index')
  // res.redirect('/views')

}

const home = async(req,res,next)=>{

      res.redirect('/admin')


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

const forgot_password=async(req,res,next)=>{

  res.render('forgot-password') 

}


  //--------------------- Export Start ------------------------------------------
export { home , index , about , games, blog, contact, forgot_password, privacypolicy, termscondition }


         
