const userModel = require('../models/userSchema.js');
const serverModel = require('../models/serverSchema.js');

module.exports = {
    
    addUser: async (obj) => {
        let user = await userModel.create(obj);
        user.save();
    },

    addServer: async (obj) => {
        let server = await serverModel.create(obj);
        server.save();
    }

};