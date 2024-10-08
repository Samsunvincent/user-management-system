// const jwt = require('jsonwebtoken');
// let login = require('../db/model/model')
// const dotenv = require('dotenv');
// dotenv.config();

// const control_data = require('../user-controller/contol-Data.json');




// const {success_function , error_function} = require('../util/response-handler');

// exports.accessControl = async function (access_types,req,res,next){
//     try {
       

//         if(access_types === '*'){
//             next();

//         }else{
//             const authHeader = req.headers['authorization'];
//             console.log("authHeader : ",authHeader);

//             if(!authHeader){
//                 let response = error_function({
//                     statusCode : 400,
//                     message : "please login to continue"
//                 });
//                 res.status(response.statusCode).send(response);
//                 return;

//             }

//             const token = authHeader.split(" ")[1];
//             console.log('token',token);

//             if(!token || token==null || token ==undefined || token == ""){
//                 let response = error_function({
//                     statusCode : 400,
//                     message : "Invalid access token"
//                 });
//                 res.status(response.statusCode).send(response);
//                 return;
//             }else{
//                 jwt.verify(token, process.env.PRIVATE_KEY, async function(err,decoded){
//                     if(err){
//                         let response = error_function({
//                             statusCode : 400,
//                             message : err.message ? err.message : "authentication failed"
//                         })
//                         res.status(response.statusCode).send(response);
//                         return;

//                     }
//                     else{
//                         console.log("decoded",decoded);

//                         let user = await login.findOne({_id : decoded.user_id}).populate("userType");
//                         console.log("user from access control",user);

                        
//                         console.log("user",user);

//                         let id = user._id;
//                         console.log("id from access control",id);

//                         req.params = id;
//                         console.log("req.params",req.params);

//                         let user_type = user.userType.user_type;
//                         console.log('user_type',user_type);

//                         let allowed = access_types.split(",").map((obj)=>control_data[obj]);
//                         console.log("allowed",allowed);

//                         if(allowed && allowed.includes(user_type)){
//                             next();

//                         }else{
//                             let response = error_function({
//                                 statusCode : 400,
//                                 message : "Not allowed to access the route"
//                             });
//                             res.status(response.statusCode).send(response);
//                             return;
//                         }
                        

                      

//                     }
//                 })

//                 }
//             }

//         }
//     catch (error) {
//         console.log("error",error);

//         let response = error_function({
//             statusCode : 400,
//             message : error.message ? error.message : "something went wrong",

//         });
//         res.status(response.statusCode).send(response)
//     }
// }


const jwt = require('jsonwebtoken');
let login = require('../db/model/model')
const dotenv = require('dotenv');
dotenv.config();
const control_data = require('../user-controller/contol-Data.json');


exports.accessControl = async function (access_types, req, res, next) {
    try {
        console.log("access_types", access_types);
        

        if (access_types === '*') {
            next();
        } else {

            const authHeader = req.headers["authorization"];
            console.log("authHeader : ", authHeader);

            if (!authHeader) {
                let response = error_function({
                    statuscode: 400,
                    message: "Please login to continue",
                });
                res.status(response.statuscode).send(response);
                return;
            }

            const token = authHeader.split(" ")[1];
            console.log("token : ", token);


            if (!token || token === "null" || token === "undefined") {
                let response = error_function({
                    statuscode: 400,
                    message: "Invalid access token",
                });
                res.status(response.statuscode).send(response);
                return;
            } else {

                jwt.verify(token, process.env.PRIVATE_KEY, async function (err, decoded) {
                    if (err) {
                        let response = error_function({
                            statuscode: 400,
                            message: err.message ? err.message : "Authentication Failed",
                        });
                        res.status(response.statuscode).send(response);
                        return;
                    } else {
                        console.log("decoded :", decoded);
                
                        let user = await login.findOne({ _id: decoded.user_id }).populate('userType');
                        console.log("user", user);
                
                        if (!user) {
                            let response = error_function({
                                statuscode: 404,
                                message: "User not found",
                            });
                            res.status(response.statusCode).send(response);
                            return;
                        }
                
                        if (!user.userType) {
                            let response = error_function({
                                statusCode: 404,
                                message: "User type not found",
                            });
                            res.status(response.statusCode).send(response);
                            return;
                        }
                
                        let user_type = user.userType.user_type;
                        console.log("user_type", user_type);
                
                        let allowed = access_types.split(",").map((obj) => control_data[obj]);
                        console.log("allowed", allowed);
                
                        if (allowed && allowed.includes(user_type)) {
                            next();
                        } else {
                            let response = error_function({
                                statuscode: 400,
                                message: "Not allowed to access the route",
                            });
                            res.status(response.statuscode).send(response);
                            return;
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.log("error : ", error);
        let response = error_function({
            statuscode: 500,
            message: "Internal Server Error",
        });
        res.status(response.statuscode).send(response);
    }
};
