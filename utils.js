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

const getUrlsWithAnalytics = (urls, database) => {
  const urlsWithAnalytics = {};
  for (const id in urls) {
    let uniqueVisitorsIds = [];

    let totalVisits = 0;
    let uniqueVisits = 0;

    for (const statId in database) {
      const { urlId, visitorId } = database[statId];

      if (id === urlId) {
        totalVisits++;
      }

      if (id === urlId && !uniqueVisitorsIds.includes(visitorId)) {
        uniqueVisitorsIds.push(visitorId);
        uniqueVisits++;
      }
    }

    urlsWithAnalytics[id] = { ...urls[id], totalVisits, uniqueVisits };
  }

  return urlsWithAnalytics;
};

const getUrlStats = (urlId, database) => {
  const stats = {};
  for (const id in database) {
    if (database[id].urlId === urlId) {
      stats[id] = database[id];
    }
  }
  return stats;
};

module.exports = {
  generateNewId,
  getUserByEmail,
  getUrlsByUserId,
  getUrlsWithAnalytics,
  getUrlStats,
};
