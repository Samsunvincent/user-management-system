let login = require('../db/model/model');
const userType = require('../db/model/user-type');
const { fileDelete } = require('../util/delete-file');
const { success_function, error_function } = require('../util/response-handler')
const bcrypt = require('bcrypt')
const sendemail = require('../util/send-email').sendEmail
const resetPassword = require('../user-controller/email-templates/set-password').resetPassword
const fileupload = require('../util/file-upload').fileUpload
const path = require('path'); 
const dotenv = require("dotenv");
const { dataUpload ,  getserverData } = require('../util/file-upload');
dotenv.config()





// exports.signin  = async function(req,res){
//     try {
        
//         let body = req.body;
//         console.log('body from signin',body);

//         let body_user_type = body.user_type;
//         console.log("body_user_type",body_user_type);

//         let emails = body.email;
//         console.log("email",emails)

//         let name = body.name;
//         console.log("name",name);
        
        
//         // let match = await userType.findOne({ user_type : body.user_type});
//         // console.log('match',match);
        
//         // let id = match._id;
//         // body.user_type = id
//         console.log('body.userType',body.user_type)

//         let image = body.image;
//         console.log("image nnnnn",image);

//         if (image) {
//             let img_path = await fileupload(image, "user");
//             console.log("img_path", img_path);
//             body.image = img_path
//         }


//         function generateRandomPassword(length) {
//             let charset =
//               "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
//             let password = "";
  
//             for (var i = 0; i < length; i++) {
//               var randomIndex = Math.floor(Math.random() * charset.length);
//               password += charset.charAt(randomIndex);
//             }
  
//             return password;
//           }
  
//           var randomPassword = generateRandomPassword(12);
//           console.log('randomPassword',randomPassword);

//         // let content = await resetPassword(name,emails,randomPassword)

//         // await sendemail(emails,"update password",content)


  
//           let salt = bcrypt.genSaltSync(10);
//           let password = bcrypt.hashSync(randomPassword, salt);
//           console.log("password0",password);



//           let new_body = {
//             name : req.body.name,
//             email : req.body.email,
//             password : password,
//             phone : req.body.phone,
//             age : req.body.age,
//             userType : req.body.user_type,
//             image : req.body.image

//           }
//           let serverData = await getserverData()
//           console.log("serverData",serverData)
//           let strbody 
//           if(serverData === null){
//             let dataArr=[]
//               dataArr.push(new_body);
//             console.log('dataArr',dataArr)
//             strbody = JSON.stringify(dataArr)

//           }else{
//             let parsed_data = JSON.parse(serverData);
//             console.log("parsed_Data",parsed_data.length)

//             parsed_data.length?Math.max(parsed_data.map(parsed_data=>parsed_data.id))+1:1
           
//             let dataArr
//             console.log("server adata",parsed_data,typeof(parsed_data));
//             // ser.push(parsed_data);
//             console.log('dataArr',dataArr)
  
//             parsed_data.push(new_body);
//             console.log('parsed ... ... ...',parsed_data)
//             strbody = JSON.stringify(parsed_data)
//           }


          

          
//         await dataUpload(strbody,'datas')
        

//         // console.log("id",id);

//         //hashing the password

     

//         // let hashed_confirm_Password = bcrypt.hashSync(body.confirm_password,salt);


    

//         // body.confirm_password = hashed_confirm_Password;
//         // console.log("hashed_confirm_password : ",hashed_confirm_Password);

//         //save to database

//         // let new_user = await login.create(new_body)
      

//         let response = success_function({
//             success : true,
//             statusCode: 200,
//             message : "user created succesfully"
//         })
//         res.status(response.statusCode).send(response)
//         return;
//     } catch (error) {
//         console.log("error",error)
//         let response = error_function({
//             success: false,
//             statusCode : 400,
//             message : "user creation failed"
//         })
//         res.status(response.statusCode).send(response)
//         return;
//     }
// }




exports.signin = async function(req, res) {
    try {
        let body = req.body;
        console.log('Body from signin:', body);

        let { user_type, email, name, image, phone, age } = body;
        console.log('User type:', user_type);
        console.log('Email:', email);
        console.log('Name:', name);

        // If an image is provided, upload it and update the image path in the body
        if (image) {
            let img_path = await fileupload(image, "user");
            console.log("Image path:", img_path);
            body.image = img_path;
        }

        // Function to generate a random password
        function generateRandomPassword(length) {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
            let password = "";
            for (let i = 0; i < length; i++) {
                let randomIndex = Math.floor(Math.random() * charset.length);
                password += charset.charAt(randomIndex);
            }
            return password;
        }

        let randomPassword = generateRandomPassword(12);
        console.log('Generated random password:', randomPassword);

        // Hash the generated random password
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(randomPassword, salt);
        console.log('Hashed password:', hashedPassword);

        // Fetch server data to get the current list of users
        let serverData = await getserverData();
        let dataArr = [];

        if (serverData === null) {
            // If no server data exists, start with an empty array
            console.log('No existing users found. Initializing user list.');
        } else {
            // Parse the existing server data (array of users)
            dataArr = JSON.parse(serverData);
            console.log('Existing users:', dataArr);
        }

        // Generate a unique user ID based on the length of the current user array
        let userId = dataArr.length + 1; // ID is one more than the length of the array
        console.log('Generated User ID:', userId);

        // Create a new body object with all the required fields, including the generated ID
        let new_body = {
            id: userId, // Assign the ID based on array length
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            age: age,
            userType: user_type,
            image: body.image
        };

        // Add the new user to the data array
        dataArr.push(new_body);
        console.log('Updated user list:', dataArr);

        // Convert the updated data array to a string for storage
        let strbody = JSON.stringify(dataArr);

        // Upload the updated data to the server
        await dataUpload(strbody, 'datas');

        // Return a success response
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "User created successfully"
        });
        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error('Error:', error);

        // Return an error response
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "User creation failed"
        });
        res.status(response.statusCode).send(response);
    }
};


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

    let splittedImg;
    
    if(body.image){
        let image_path = await login.findOne({_id:id})
        console.log('image_path',image_path)

         splittedImg = image_path.image.split('/')[2] // Extract the file name
         console.log("image_path.image",image_path.image);

       let  img_path = await fileupload(body.image, "user");
        console.log("img_path", img_path);
         body.image = img_path;
    }

    let updatedData = await login.updateOne({_id : id}, {$set : body}).populate('userType')
    if(body.image){
        const imagePath = path.join('./uploads','user',splittedImg);
        fileDelete(imagePath);
    }

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

exports.resetPassword = async function(req,res){


try {
    let _id = req.params.id

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

