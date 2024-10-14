let login = require('../db/model/model')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const { success_function, error_function } = require('../util/response-handler')
const dotenv = require('dotenv')
dotenv.config()
const resetpassword = require('../user-controller/email-templates/resetpassword').resetPassword
let sendEmail  = require('../util/send-email').sendEmail

exports.login = async function (req, res) {
    try {

        let email = req.body.email
        console.log("email", email)

        let check_user = await login.findOne({ email }).populate('userType')

        if (check_user) {
            let password = req.body.password
            let db_password = check_user.password

            let password_match = bcrypt.compareSync(password, db_password);
            console.log('password_match', password_match)

            check_user.isFirstLogin = false;  // Update first login flag

            await check_user.save();

            if (password_match) {
                let token = jwt.sign({ user_id: check_user._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
                console.log("token : ", token);

                // let token_id = user_id;
                // console.log("token_id",token_id)
                let response_data = {
                    id: check_user._id,
                    user_type: check_user.userType.user_type,
                    token: token,
                    isFirstLogin: check_user.isFirstLogin
                }
                console.log("response_data", response_data);


                let response = success_function({
                    success: true,
                    statusCode: 200,
                    message: "token",
                    data: response_data,
                });
                res.status(response.statusCode).send(response);
                return;
            }

        }
        else {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "user not found",

            });
            res.status(response.statusCode).send(response);
            return;

        }
    } catch (error) {
        console.log("error", error)
    }
}

exports.forgetpassword = async function (req, res) {
    try {
        let email = req.body.email;
    console.log("email from user", email);

    let check_user = await login.findOne({ email });
    console.log("check_user", check_user);


    if (check_user) {
        let reset_token = jwt.sign({ user_id: check_user._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" })
        // console.log("forgot token",forgot_token);

        let data = await login.updateOne({ email: email }, { $set: { password_token: reset_token } });

        if (data.matchedCount === 1 && data.modifiedCount === 1) {
            let reset_link = `${process.env.FRONTEND_URL}/reset password?token=${reset_token}`;
            // let email_template = await resetpassword(check_user.name, reset_link);
            // sendEmail(email, "Forgot password", email_template);
            let response = success_function({
                statusCode: 200,
                message: "Email sent successfully",
            });
            res.status(response.statusCode).send(response);
            return;

        }
    }
    } catch (error) {
        console.log("error",error);
        let response = error_function({
            status: 400,
            message: "Password reset failed",
          });
          res.status(response.statusCode).send(response);
          return;

    }
}