const userModel = require('../models/userSchema.js');
const serverModel = require('../models/serverSchema.js');

module.exports = {

    updateUser: async (ids, obj) => {
        await userModel.updateOne({
            "ID.userID": ids[0],
            "ID.serverID": ids[1]
        }, obj, {
            upsert: true
        }).catch(console.error);
    },

    updateServer: async (serverID, obj) => {
        await serverModel.updateOne({
            serverID: serverID
        }, obj, {
            upsert: true
        }).catch(console.error);
    },

    getUser: async (userID, serverID) => await userModel.findOne({
        userID: userID,
        serverID: serverID
    }),

    getAllUsers: async () => await userModel.find(),

};