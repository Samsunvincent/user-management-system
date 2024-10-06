const jwt = require('jsonwebtoken');
let login = require('../db/model/model')
const dotenv = require('dotenv');
dotenv.config();

const control_data = require('../user-controller/contol-Data.json');




const {success_function , error_function} = require('../util/response-handler');

exports.accessControl = async function (access_types,req,res,next){
    try {
       

        if(access_types === '*'){
            next();

        }else{
            const authHeader = req.headers['authorization'];
            console.log("authHeader : ",authHeader);

            if(!authHeader){
                let response = error_function({
                    statusCode : 400,
                    message : "please login to continue"
                });
                res.status(response.statusCode).send(response);
                return;

            }

            const token = authHeader.split(" ")[1];
            console.log('token',token);

            if(!token || token==null || token ==undefined || token == ""){
                let response = error_function({
                    statusCode : 400,
                    message : "Invalid access token"
                });
                res.status(response.statusCode).send(response);
                return;
            }else{
                jwt.verify(token, process.env.PRIVATE_KEY, async function(err,decoded){
                    if(err){
                        let response = error_function({
                            statusCode : 400,
                            message : err.message ? err.message : "authentication failed"
                        })
                        res.status(response.statusCode).send(response);
                        return;

                    }
                    else{
                        console.log("decoded",decoded);

                        let user = await login.findOne({_id : decoded.user_id}).populate("userType");
                        console.log("user",user);

                        let user_type = user.userType.user_type;
                        console.log('user_type',user_type);

                        let allowed = access_types.split(",").map((obj)=>control_data[obj]);
                        console.log("allowed",allowed);

                        if(allowed && allowed.includes(user_type)){
                            next();

                        }else{
                            let response = error_function({
                                statusCode : 400,
                                message : "Not allowed to access the route"
                            });
                            res.status(response.statusCode).send(response);
                            return;
                        }
                        

                      

                    }
                })

                }
            }

        }
    catch (error) {
        console.log("error",error);

        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong",

        });
        res.status(response.statusCode).send(response)
    }
}
