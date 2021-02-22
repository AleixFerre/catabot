const userModel = require('../models/userSchema.js');
const serverModel = require('../models/serverSchema.js');

module.exports = {

    updateUser: async (ids, obj) => {
        await userModel.findOneAndUpdate({
            "IDs.userID": ids[0],
            "IDs.serverID": ids[1]
        }, obj, {
            upsert: true,
            setDefaultsOnInsert: true,
        }).catch(console.error);
    },

    updateAllUsers: async (obj) => {
        await userModel.updateMany({}, obj);
    },

    updateServer: async (serverID, obj) => {
        await serverModel.updateOne({
            serverID: serverID
        }, obj, {
            upsert: true
        }).catch(console.error);
    },

    deleteUser: async (ids) => {
        await userModel.deleteOne({
            "IDs.userID": ids[0],
            "IDs.serverID": ids[1]
        });
    },

    deleteServer: async (serverID) => {
        await serverModel.deleteOne({
            serverID: serverID
        });
    },

    getUser: async (userID, serverID) => await userModel.findOne({
        userID: userID,
        serverID: serverID
    }),

    getServer: async (serverID) => await serverModel.findOne({
        serverID: serverID
    }),

    getAllUsers: async () => await userModel.find(),

    getUsersFromServer: async (serverID) => await userModel.find({
        "IDs.serverID": serverID
    }),

};