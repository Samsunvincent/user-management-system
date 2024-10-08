let login = require('../db/model/model');
const userType = require('../db/model/user-type');
const { success_function, error_function } = require('../util/response-handler')
const bcrypt = require('bcrypt')
const sendemail = require('../util/send-email').sendEmail
const resetPassword = require('../user-controller/email-templates/set-password').resetPassword



exports.signin  = async function(req,res){
    try {
        
        let body = req.body;
        console.log('body from signin',body);

        let body_user_type = body.user_type;
        console.log("body_user_type",body_user_type);

        let emails = body.email;
        console.log("email",emails)

        let name = body.name;
        console.log("name",name);
        
        
        let match = await userType.findOne({ user_type : body.user_type});
        console.log('match',match);
        
        let id = match._id;
        body.user_type = id
        console.log('body.userType',body.user_type)

        function generateRandomPassword(length) {
            let charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
            let password = "";
  
            for (var i = 0; i < length; i++) {
              var randomIndex = Math.floor(Math.random() * charset.length);
              password += charset.charAt(randomIndex);
            }
  
            return password;
          }
  
          var randomPassword = generateRandomPassword(12);
          console.log(randomPassword);

        let content = await resetPassword(name,emails,randomPassword)

        await sendemail(emails,"update password",content)


  
          let salt = bcrypt.genSaltSync(10);
          let password = bcrypt.hashSync(randomPassword, salt);
          console.log("password0",password);



          let new_body = {
            name : req.body.name,
            email : req.body.email,
            password : password,
            phone : req.body.phone,
            age : req.body.age,
            userType : req.body.user_type

          }
        
        

        // console.log("id",id);

        //hashing the password

     

        // let hashed_confirm_Password = bcrypt.hashSync(body.confirm_password,salt);


    

        // body.confirm_password = hashed_confirm_Password;
        // console.log("hashed_confirm_password : ",hashed_confirm_Password);

        //save to database

        let new_user = await login.create(new_body)
      

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


// exports.updateUser = async function(req,res){
//    try {
//     let body = req.body;
//     console.log("body",body);


//     let id = req.params.id;
//     console.log('id form put',id);

//     let updatedData = await login.updateOne({_id : id}, {$set : body}).populate('userType')


//     let response = success_function({
//         success : true,
//         statusCode : 200,
//         message : "updation successfull",
//         data : updatedData
//     })
//     res.status(response.statusCode).send(response);
//     return;
//    } catch (error) {
//     console.log("error while updating",error);

//     let response = error_function({
//         success : false,
//         statusCode : 400,
//         message : "updation failed",

//     });
//     res.status(response.statusCode).send(response);
//     return;
    
//    }

// }

exports.update = async function (req,res){
    
    try {
        let body = req.body;
        console.log("body",body);



        let data= {
            name : body.name,
            email : body.email,
            phoneno : body.phoneno,
            password : body.password,
            usertype : body.user_type
        }

        
    updateId = req.params.id 
    console.log("updateId",updateId);

    let update_employee = await login.updateOne({_id : updateId},data);
    console.log("updateemployee",update_employee);

    let response = success_function({
        success: true,
        statusCode:200,
        data:update_employee,
        message: "successfully Updated..",
        
    })
    res.status(response.statusCode).send(response)
    return;

    

    } catch (error) {

    console.log("error : ", error);
    let response = error_function({
        success: false,
        statusCode: 400,
        message: "error"
    })
    res.status(response.statusCode).send(response)
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

exports.resetPassword = async function(req,res){


try {
    let _id = req.params

    let email = req.body.email;
    console.log("email",email);

    let user = await login.findOne({_id});
    console.log("user",user);

    let passwordMatch =  bcrypt.compareSync(req.body.password,user.password);
    console.log("password",passwordMatch)

    if(passwordMatch){
        let body = req.body

        let newpassword = req.body.newpassword;
        console.log("newpassword",newpassword);

        const salt = bcrypt.genSaltSync(10) 

        const hashed_Password = await bcrypt.hash(newpassword,salt);
        console.log("hashed_password",hashed_Password);

        body.password = hashed_Password;
        console.log("body.password",body.password);

        let updatePassword = await login.updateOne({_id},{$set:{password : body.password}});
        console.log("updatedpassword",updatePassword);

        let response = success_function({
            success: true,
            statusCode: 200,
            message: "password reset successfull",
            data: updatePassword
        })
        res.status(response.statusCode).send(response);
        return;
        


    }
} catch (error) {
    console.log("error",error)

    let response = error_function({
        success: false,
        statusCode: 400,
        message: "deleting failed",

    })
    res.status(response.statusCode).send(response)
    return;
}

    
}