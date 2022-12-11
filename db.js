const db = {
  urls: {
    q2w3e4: {
      id: 'q2w3e4',
      longURL: 'https://www.lighthouselabs.ca',
      userId: 'o9i8u7',
    },
    a1s2d3: {
      id: 'a1s2d3',
      longURL: 'https://www.google.com',
      userId: 'g5h6j7',
    },
  },
  users: {
    o9i8u7: {
      id: 'o9i8u7',
      email: 'user1@example.com',
      password: '123',
    },
    g5h6j7: {
      id: 'g5h6j7',
      email: 'user2@example.com',
      password: '123',
    },
  },
  stats: {
    t7y8u9: {
      id: 't7y8u9',
      visitorId: 'c1n4m6',
      urlId: 'a1s2d3',
      createdAt: 1670747099376,
    },
    f3h4j5: {
      id: 'f3h4j5',
      visitorId: 'c1n4m6',
      urlId: 'a1s2d3',
      createdAt: 1670747128992,
    },
  },
};

module.exports = db;
