const userModel = require('../models/userSchema.js');
const serverModel = require('../models/serverSchema.js');

module.exports = {

    updateUser: async (obj) => {
        await userModel.updateOne(query, obj, {
            upsert: true
        }).catch(console.error);
    },

    updateServer: async (query, obj) => {
        await serverModel.updateOne(query, obj, {
            upsert: true
        }).catch(console.error);
    }

};