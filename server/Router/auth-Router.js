const express = require('express');
const router = express.Router();
const authcontroller = require('../user-controller/auth-Contoller');
const accessControl = require('../util/access-control').accessControl

function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}


router.post('/login',setAccessControl('*'),authcontroller.login);
router.post('/forgot-password',setAccessControl('*') ,authcontroller.forgetpassword);
router.patch('/reset-password',setAccessControl('*'),authcontroller.passwordResetController)



module.exports = router

