const { query } = require("express");
const bcrypt = require('bcrypt');
const pool = require("../model/connection.js");

exports.displayUserDataService = async () => {
  try {
    const userResult = await pool.query(
      "select users.user_id,users.user_fname,users.user_mname,users.user_lname,users.user_email,users.user_date_of_birth,users.user_gender,users.user_username,users.user_password,user_address.address,user_address.street,user_address.landmark,user_address.city,user_address.pincode,user_states.user_state from users inner join user_address on users.user_id=user_address.user_id inner join user_states on user_address.user_id=user_states.user_id where users.user_delete=$1",
      ["0"]
    );
    return userResult.rows;
  } catch (error) {
    console.log(error);
  }
};

exports.insertDataService = async (bodyData) => {
    console.log(bodyData);
    const saltRounds = 10;
    const hash = bcrypt.hashSync(bodyData.user_password, saltRounds);
 

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let emailExist = await client.query(`select user_email from users where user_email=$1`,[bodyData.email])

    if(emailExist.rowCount>0){
      return false;
    }

    const results = await client.query(
      "insert into users(user_fname,user_mname,user_lname,user_email,user_date_of_birth,user_gender,user_username,user_password)values($1,$2,$3,$4,$5,$6,$7,$8)RETURNING user_id",
      [
        bodyData.user_fname,
        bodyData.user_mname,
        bodyData.user_lname,
        bodyData.user_email,
        bodyData.user_date_of_birth,
        bodyData.user_gender,
        bodyData.user_username,
        hash,
      ]
    );
    await client.query(
      "insert into user_address(user_id,address,street,landmark,city,pincode)values($1,$2,$3,$4,$5,$6)RETURNING id",
      [
        results.rows[0].user_id,
        bodyData.address,
        bodyData.street,
        bodyData.landmark,
        bodyData.city,
        bodyData.pincode,
      ]
    );

    await client.query(
      "insert into user_states(user_id,user_state)values($1,$2)",
      [results.rows[0].user_id, bodyData.user_state]
    );
    await client.query("COMMIT");
    return true; 
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

//delete user from table
exports.deleteUserService = async (reqParamsId) => {
  console.log(reqParamsId);

  const client = await pool.connect();
  try {
    const results = await client.query(
      "update users SET user_delete=$1 where user_id=$2",
      ["1", reqParamsId]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.updateDataService = async (reqParamsId, bodyData) => {
 
  const saltRounds = 10;
  const hash = bcrypt.hashSync(bodyData.user_password, saltRounds);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(
      "update users SET user_fname=$1,user_mname=$2,user_lname=$3,user_email=$4,user_date_Of_Birth=$5,user_gender=$6,user_username=$7,user_password=$8 where user_id= $9",
      [
        bodyData.user_fname,
        bodyData.user_mname,
        bodyData.user_lname,
        bodyData.user_email,
        bodyData.user_date_of_birth,
        bodyData.user_gender,
        bodyData.user_username,
        hash,
        reqParamsId
      ]
    );

     await client.query(
      "update user_address SET address=$1,street=$2,landmark=$3,city=$4,pincode=$5 where user_id= $6",
      [
        bodyData.address,
        bodyData.street,
        bodyData.landmark,
        bodyData.city,
        bodyData.pincode,
        reqParamsId
      ]
    );

    await client.query(
      "update user_states SET user_state=$1 where user_id= $2",
      [
        bodyData.user_state,
        reqParamsId
      ]
    );
    await client.query("COMMIT");
    console.log(results);
    return results;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};


exports.searchDataService =async (reqParamsEmail)=>{
 console.log(reqParamsEmail);
  try {
    const userResult = await pool.query(
      "select users.user_id,users.user_fname,users.user_mname,users.user_lname,users.user_email,users.user_date_of_birth,users.user_gender,users.user_username,users.user_password,user_address.address,user_address.street,user_address.landmark,user_address.city,user_address.pincode,user_states.user_state from users inner join user_address on users.user_id=user_address.user_id inner join user_states on user_address.user_id=user_states.user_id where users.user_delete=$1 AND users.user_email=$2",
      ["0",reqParamsEmail]
    );
    console.log(userResult);
    return userResult.rows[0];
  } catch (error) {
    throw error;
  }
}


exports.paginationDataService =async (page,limit)=>{
  page = parseInt(page);
  limit=parseInt(limit)
  const client = await pool.connect();

  var off=(page-1)*limit

  try {

    await client.query("BEGIN");

  const recordCountResult = client.query(`select count(*) from users where users.user_delete='0'`);

  const result = client.query(
    `select users.user_id,users.user_fname,users.user_mname,users.user_lname,users.user_email,users.user_date_of_birth,users.user_gender,users.user_username,users.user_password,user_address.address,user_address.street,user_address.landmark,user_address.city,user_address.pincode,user_states.user_state from users inner join user_address on users.user_id=user_address.user_id inner join user_states on user_address.user_id=user_states.user_id where users.user_delete='0' ORDER BY users.user_id limit ${limit} offset ${off}`
  );
  await client.query("COMMIT");
  let totalRecords= (await recordCountResult).rows[0].count;
  dataThroughPage=(await result).rows;
  return {data:dataThroughPage, totalCount:totalRecords }
    
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  
}

