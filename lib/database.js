const userModel = require('../models/userSchema.js');
const serverModel = require('../models/serverSchema.js');

module.exports = {
  /**
   * Update a User from the DB.
   * @param ids List of ids from [0: UserID, 1: ServerID]
   * @param obj The new obj describing the new User info.
   */
  updateUser: async (ids, obj) => {
    await userModel
      .findOneAndUpdate(
        {
          'IDs.userID': ids[0],
          'IDs.serverID': ids[1],
        },
        obj,
        {
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )
      .catch(console.error);
  },

  /**
   * Update ALL Users from the DB.
   * @param obj The new obj describing the new User info.
   */
  updateAllUsers: async (obj) => {
    await userModel.updateMany({}, obj);
  },

  /**
   * Update ALL Users from a Server from the DB.
   * @param serverID string describing the ServerID from the all the users
   * @param obj The new obj describing the new User info.
   */
  updateAllUsersFromServer: async (serverID, obj) => {
    await userModel.updateMany(
      {
        'IDs.serverID': serverID,
      },
      obj
    );
  },

  /**
   * Update a Server from the DB.
   * @param serverID string describing the ServerID you want to update.
   * @param obj The new obj describing the new Server info.
   */
  updateServer: async (serverID, obj) => {
    await serverModel
      .updateOne({ serverID: serverID }, obj, {
        upsert: true,
      })
      .catch(console.error);
  },

  /**
   * Delete a user from the DB given a UserID and and a ServerID.
   * @param ids List of ids from [0: UserID, 1: ServerID]
   */
  deleteUser: async (ids) => {
    await userModel.deleteOne({
      'IDs.userID': ids[0],
      'IDs.serverID': ids[1],
    });
  },

  /**
   * Delete a server from the DB a ServerID
   * @param serverID string describing ServerID
   */
  deleteServer: async (serverID) => {
    await serverModel.deleteOne({ serverID: serverID });
  },

  /**
   * Get a User info given a UserID and a ServerID
   * @param userID string describing the UserID
   * @param serverID string describing the ServerID
   * @returns userModel
   */
  getUser: async (userID, serverID) =>
    await userModel.findOne({
      'IDs.userID': userID,
      'IDs.serverID': serverID,
    }),

  /**
   * Get a Server info given a ServerID
   * @param serverID string describing the ServerID
   */
  getServer: async (serverID) =>
    await serverModel.findOne({
      serverID: serverID,
    }),

  /**
   * Get ALL the Users from the DB.
   */
  getAllUsers: async () => await userModel.find(),

  /**
   * Get ALL the Servers from the DB.
   */
  getAllServers: async () => await serverModel.find(),

  /**
   * Get ALL the Users from a Server the DB.
   * @param serverID string describing the ServerID
   */
  getUsersFromServer: async (serverID) =>
    await userModel.find({
      'IDs.serverID': serverID,
    }),
};
