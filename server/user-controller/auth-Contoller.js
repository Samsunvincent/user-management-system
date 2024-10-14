let login = require('../db/model/model')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const {success_function , error_function} = require('../util/response-handler')
const dotenv = require('dotenv')
dotenv.config()

exports.login = async function(req,res){
   try {

    let email = req.body.email
    console.log("email",email)

    let check_user = await login.findOne({email}).populate('userType')
    
    if(check_user){
        let password = req.body.password
        let db_password = check_user.password

        let password_match = bcrypt.compareSync(password , db_password);
        console.log('password_match',password_match)

        check_user.isFirstLogin = false;  // Update first login flag

        await check_user.save();

        if(password_match){
            let token = jwt.sign({user_id : check_user._id}, process.env.PRIVATE_KEY,{expiresIn : "10d"});
            console.log("token : ",token);

            // let token_id = user_id;
            // console.log("token_id",token_id)
            let response_data ={
                id : check_user._id,
                user_type :  check_user.userType.user_type,
                token : token,
                isFirstLogin : check_user.isFirstLogin
            }
            console.log("response_data",response_data);
            

            let response = success_function({
                success : true,
                statusCode : 200,
                message : "token",
                data : response_data,
            });
            res.status(response.statusCode).send(response);
            return;
        }
      
    }
    else{
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "user not found",

        });
        res.status(response.statusCode).send(response);
        return;

    }
   } catch (error) {
        console.log("error",error)
   }
}