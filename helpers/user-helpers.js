const db = require('../config/connection');
const collection = require('../config/collection');
const bcrypt = require('bcrypt')
let ObjectId = require('mongodb').ObjectId;

module.exports = {

    toSingUp: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ emailId: body.emailId }).then(async(result) => {
                if (result) {
                    resolve({ emailError: true })
                } else {
                    body.password = await bcrypt.hash(body.password,10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(body).then(()=>{
                        resolve()
                    })
                }
            })
        })
    },

    toSingIn:(body)=>{
        return new Promise(async(resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({emailId:body.emailId})
            if(user){
                bcrypt.compare(body.password,user.password).then((result)=>{
                    if(result){
                        delete user.password
                        resolve(user);
                    }else{
                        resolve({passwordError : true})
                    }
                })
            }else{
                resolve({emailError : true})
            }
         })
    },

   

}