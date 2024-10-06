let login = require('../db/model/model');
const userType = require('../db/model/user-type');
const { success_function, error_function } = require('../util/response-handler')
const bcrypt = require('bcrypt')



exports.signin  = async function(req,res){
    try {
        
        let body = req.body;
        console.log('body from signin',body);

        let body_user_type = body.user_type;
        console.log("body_user_type",body_user_type);

        let match = await userType.findOne({ user_type : body_user_type});
        console.log('match',match);


        let id = match._id;
        console.log("id",id);

        body.userType = id
        //hashing the password

        let salt = bcrypt.genSaltSync(10)
        console.log("salt",salt)

        let hashed_Password = bcrypt.hashSync(body.password,salt);
        console.log("hashed password : ",hashed_Password);

        // let hashed_confirm_Password = bcrypt.hashSync(body.confirm_password,salt);


        body.password = hashed_Password;
        console.log('password :' ,body.password);

        // body.confirm_password = hashed_confirm_Password;
        // console.log("hashed_confirm_password : ",hashed_confirm_Password);

        //save to database

        let new_user = await login.create(body)
      

        let response = success_function({
            success : true,
            statusCode: 200,
            message : "user created succesfully"
        })
        res.status(response.statusCode).send(response)
        return;
    } catch (error) {
        console.log("error",error)
        let response = error_function({
            success: false,
            statusCode : 400,
            message : "user creation failed"
        })
        res.status(response.statusCode).send(response)
        return;
    }
}

exports.getAllData = async function(req,res){
    try {
        
        let user_data = await login.find().populate('userType')
        console.log("user_Data",user_data);

        let response = success_function({
            success : true,
            statusCode: 200,
            message : "user created succesfully",
            data : user_data
        })
        res.status(response.statusCode).send(response)
        return;

        } catch (error) {
        console.log("error",error);
        
        let response = error_function({
            success: false,
            statusCode : 400,
            message : "user fetching failed"
        })
        res.status(response.statusCode).send(response)
        return;

    }
}

exports.getsingle = async function (req,res){
    try {

        Singleid = req.params.id
        console.log("Singleid",Singleid);

        SingleData = await login.findOne({_id :Singleid}).populate('userType')
        console.log("SingleUser",SingleData);

        let response = success_function({
         success: true,
         statuscode: 200,
         message: "successfully get the single data..",
         data : SingleData
     })
     res.status(response.statusCode).send(response)
     return;
 
 } catch (error) {
 
     console.log("error : ", error);
     let response = error_function({
         success: false,
         statuscode: 400,
         message: "error"
     })
     res.status(response.statusCode).send(response)
     return;
 }

}


exports.updateUser = async function(req,res){
   try {
    let body = req.body;
    console.log("body",body);


    let id = req.params.id;
    console.log('id form put',id);

    let updatedData = await login.updateOne({_id : id}, {$set : body}).populate('userType')


    let response = success_function({
        success : true,
        statusCode : 200,
        message : "updation successfull",
        data : updatedData
    })
    res.status(response.statusCode).send(response);
    return;
   } catch (error) {
    console.log("error while updating",error);

    let response = error_function({
        success : false,
        statusCode : 400,
        message : "updation failed",

    });
    res.status(response.statusCode).send(response);
    return;
    
   }

}

exports.deleteUser = async function(req,res){
    try {
        
        let id = req.params.id;
        console.log("id from delete",id);

        let delete_Data = await login.deleteOne({_id : id});
        console.log("delete_Data",delete_Data);

        let response = success_function({
            success: true,
            statusCode: 200,
            message: "delete successfull",
            data: delete_Data
        })
        res.status(response.statusCode).send(response);
        return;

    } catch (error) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "deleting failed",

        })
        res.status(response.statusCode).send(response)
        return;
    }

    
}