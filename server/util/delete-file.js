const fs = require('fs');
const { resolve } = require('path');

exports.fileDelete = async function (filePath) {
    console.log("filepath : ", filePath);

    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {

            if(err){
                console.log("error while deleting the image",err);
                return reject(err);
            }
            console.log('image deleted successfully');
            resolve();

        });
    });
};