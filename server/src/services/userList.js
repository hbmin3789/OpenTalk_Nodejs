const userList = {};

const setUserName = (userID, userName) => {
    userList[userID] = userName;
};

const getUserName = (userID) => {
    return userList[userID];
};

module.exports = {setUserName, getUserName};