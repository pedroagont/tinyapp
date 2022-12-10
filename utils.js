const generateNewId = (length = 6) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getUserByEmail = (email, database) => {
  let user = null;
  for (const id in database) {
    const usr = database[id];
    if (usr.email === email) {
      user = database[id];
    }
  }
  return user;
};

const getUrlsByUserId = (userId, database) => {
  const urls = {};
  for (const id in database) {
    const u = database[id];
    if (u.userId === userId) {
      urls[id] = database[id];
    }
  }
  return urls;
};

module.exports = { generateNewId, getUserByEmail, getUrlsByUserId };
