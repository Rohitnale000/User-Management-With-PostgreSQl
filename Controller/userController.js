var validator = require('validator');

const { displayUserDataService,insertDataService,deleteUserService, updateDataService,searchDataService, paginationDataService} = require("../Services/userService.js");
const  displayUserData =  async(req, res) => {
let result  =  await displayUserDataService();
  
  if(result.length>0){
    res.status(200).send(result)
    console.log(result)
  }
  else{
    res.status(400).send("Something is wrong")
  }
 
};


//to insert data into database
const insertData =async (req,res)=>{

  

  // if(!validator.isAlpha(req.body.firstName && req.body.lastName)){
  //   res.send("Enter Valid Data")
  //   return;
  // }
      
 // console.log(req.body);
   let result = await insertDataService(req.body);
   if(result){
    res.status(200).send(`user data inserted successfully`)
  }
  else{
    res.status(400).send("Something is wrong")
  } 
}



const deleteData =async (req,res)=>{

  if(!validator.isInt(req.params.id)||validator.isEmpty(req.params.id)){
    res.send("enter valid id")
    return
  }
 
  let result =await deleteUserService(req.params.id)
  if(result){
    res.status(200).send(`user data Delete successfully`)
  }
  else{
    res.status(400).send("Something is wrong")
  } 
}


const updateData = async(req,res)=>{
  const result =await updateDataService(req.params.id,req.body)
  if(result){
    res.status(200).send(`user data updated successfully`)
  }
  else{
    res.status(400).send("Something is wrong")
  } 
}


const searchData =async (req,res)=>{
  // if(!validator.isEmail(req.params.email)||validator.isEmpty(req.params.email)){
  //   res.send("enter valid email")
  //   return;
  // }
  //console.log(req.params.email);
  const result = await searchDataService(req.params.email)
  console.log(result);
  if(result){
    res.status(200).send(result);
  }else{
    res.status(400).status("Email not found");
  }

}

const paginationData =async(req,res)=>{


  try {
    var resultFromUser = await paginationDataService(req.query.page,req.query.limit)
    if(resultFromUser.data.length>0){
      res.send(resultFromUser).status(200);
    }else{
      res.send("Data not found").status(400);
    }
    
  } catch (error) {
   console.log(error);
  }

 
 
}

module.exports = { displayUserData,insertData,deleteData,updateData,searchData,paginationData};
