const admin = require("firebase-admin");
const serviceAccount = require("../config/ovo-push-notif-firebase-adminsdk-nw6ue-81bd05527b.json");

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = firebase;