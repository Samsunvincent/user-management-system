let jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();
const {success_function , error_function} = require('../util/response-handler')

exports.checkLogin = async function(req,res,next){
    let authorization =  req.headers['Authorization']
    console.log("authorization",authorization);

    let token = authorization.split(' ')[1];
    console.log("token",token);

    if(!token || token == null){
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "Invalid-Token",

        });
        res.status(response.statusCode).send(response);
        return;
    }
    else{
        jwt.verify(token,process.env.PRIVATE_KEY,async (err,decoded)=>{
            if(err){
                let response = error_function({
                    success : false,
                    statusCode : 400,
                    message : "Invalid-Token",
        
                });
                res.status(response.statusCode).send(response);
                return;
            }
            else{
                console.log("decoded",decoded);

                let id = decoded.user_id;

                let user = await login.findOne({_id : id});
                console.log("user",user);

                if(user){
                    next();
                }
                else{
                    let response = error_function({
                        success : false,
                        statusCode : 400,
                        message : "User-not-found",
            
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }
            }
        })
    }
}