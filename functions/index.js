const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const userObj = {
  admin: false,
  diet: [],
  allergies: [],
  notifications: [],
  favorites: []
};

// ======== TEST FUNCTIONS ===============
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// http request 2
exports.redirect = functions.https.onRequest((req, res) => {
  res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
});

//http callable function
exports.testCall = functions.https.onCall((data, context) => {
  return `https://www.youtube.com/watch?v=dQw4w9WgXcQ`;
});
// =========================================



//for background triggers a value/promise must be returned

// auth trigger (new user)
exports.newUser = functions.auth.user().onCreate(user => {
  console.log('creating user..', user.uid);
  return admin.firestore().collection('users').doc(user.uid).set(userObj)
});

// auth trigger (delete user)
exports.deleteUser = functions.auth.user().onDelete(user => {
  console.log('deleting user..', user.uid);
  const doc =  admin.firestore().collection('users').doc(user.uid);
  return doc.delete();

});