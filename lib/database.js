const userModel = require('../models/userSchema');
const serverModel = require('../models/serverSchema');
const utilsModel = require('../models/utilsSchema');
const commandModel = require('../models/commandSchema');
const statsModel = require('../models/statsSchema');

module.exports = {
	initAll: (commands, users, servers, utils, stats) => {
		statsModel.remove({}, () => {
			statsModel.insertMany(stats, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted all stats');
				}
			});
		});
		commandModel.remove({}, () => {
			commandModel.insertMany(commands, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted all commands');
				}
			});
		});
		userModel.remove({}, () => {
			userModel.insertMany(users, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted all users');
				}
			});
		});
		serverModel.remove({}, () => {
			serverModel.insertMany(servers, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted all servers');
				}
			});
		});
		utilsModel.remove({}, () => {
			utilsModel.insertMany(utils, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted all utils');
				}
			});
		});
	},

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
				},
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
			obj,
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
	 * Delete ALL users that have this IDs.serverID
	 * @param serverID string describing the server ID of the users to delete
	 * @returns <number, null> - The amount of deleted users
	 */
	deleteUsersFromServer: async (serverID) => {
		return (await userModel.deleteMany({ 'IDs.serverID': serverID }))
			.deletedCount;
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
	 * Count how many users there are in the DB
	 * @returns Number
	 */
	getUserCount: async () => await userModel.countDocuments(),

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

	/**
	 * Get the last force reset info from the DB.
	 */
	getLastForceReset: async () => (await utilsModel.find())[0].lastForceReset,

	/**
	 * Set the last force reset info in the DB.
	 * @param serverID string describing the ServerID.
	 * @param channelID string describing the ChannelID.
	 */
	setLastForceReset: async (userID, channelID) => {
		console.debug(`${userID} set the last force reset to ${channelID}`);
		await utilsModel.updateOne(
			{}, // First ocurrence of the document
			{
				lastForceReset: {
					date: new Date(),
					userID: userID,
					channelID: channelID,
				},
			},
		);
	},

	resetLastForceReset: async () => {
		await utilsModel.updateOne(
			{}, // First ocurrence of the document
			{
				lastForceReset: null,
			},
		);
	},
};
