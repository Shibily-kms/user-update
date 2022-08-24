const db = require('../config/connection');
const collection = require('../config/collection');
const bcrypt = require('bcrypt')
let ObjectId = require('mongodb').ObjectId;

module.exports = {
    toSignIn: (body) => {
        return new Promise((resolve, reject) => {
            const adminDetails = {
                id: "565678",
                firstName: "Admin",
                lastName: "256",
                emailId: "admin@gmail.com",
                password: "123"
            }
            if (body.emailId == adminDetails.emailId) {
                if (body.password == adminDetails.password) {
                    let admin = adminDetails;
                    delete admin.password
                    resolve(admin)
                } else {
                    resolve({ passwordError: true })
                }
            } else {
                resolve({ emailError: true })
            }
        })
    },

    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray();
            users.forEach(object => {
                delete object['password'];
            });
            resolve(users)
        })
    },

    getOneUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) }).then((user) => {
                delete user.password
                resolve(user)
            })
        })
    },

    removeOneUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: ObjectId(userId) }).then(() => {
                resolve()
            })
        })
    },

    editUserData: (body) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(body.id) }, {
                $set: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    emailId: body.emailId
                }
            }).then(() => {
                resolve()
            })

        })
    }

}