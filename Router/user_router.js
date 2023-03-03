const express = require("express");
const{displayUserData, insertData, deleteData, updateData, searchData, paginationData}=require('../Controller/userController.js');
const router = express.Router();


//student data display
router.get("/user",displayUserData);

//insert data
router.post("/user",insertData)

//delete user that means hidden with user_delete(soft delete)
router.delete("/user/:id",deleteData)

//update user
router.put("/user/:id",updateData)

//search user with all details
router.get("/user/:email",searchData)


router.get("/user/page/limit",paginationData)

module.exports = router;

