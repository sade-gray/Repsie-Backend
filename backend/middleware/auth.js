const {firebase} = require('../cloud.firestore/firestoreNodeJS.js');

function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ error: "No token provided" }).status(401);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.send({ error: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => response.send({ error: "Could not authorize" }).status(403));
}

module.exports = authMiddleware;