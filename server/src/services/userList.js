var userList = {};

const setUserName = (userID, userName) => {
    userList[userID] = {userID, userName};
    console.log("add UserList : " + userID + userName);
    console.log("userList : " + JSON.stringify(userList));
};

const getUser = (userID) => {
    return userList[userID];
};

module.exports = {setUserName, getUser};