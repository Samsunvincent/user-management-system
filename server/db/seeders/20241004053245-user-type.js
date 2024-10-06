const user_type = require('../model/user-type')

'use strict';

module.exports = {
  up: (models, mongoose) => {
    
      return models.user_Type.insertMany([
        {
          _id : "66ff7f10605e8fd3a45bfbb9",
          user_type : "Admin"
        },
        {
          _id : "66ff7f39605e8fd3a45bfbba",
          user_type : "Employee"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
    

   
      return models.user_Type.deleteMany({
        _id :{
          $in : [
            "66ff7f10605e8fd3a45bfbb9",
            "66ff7f39605e8fd3a45bfbba"
          ]
        }
      }
      
      ).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
   
  }
};
