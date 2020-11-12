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
/*
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
});*/
// =========================================

// ================= UPVOTE =======================

exports.upvote = functions.https.onCall((data, context) => {
  // check if authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
  // get ref for fooditem doc
  const foodItem = admin.firestore().collection('fooditems').doc(data);
  return foodItem.get().then(doc => {

    // check if user has upvoted already (in that case -> remove upvote status)
    if (doc.data().user_upvotes.includes(context.auth.uid)) {
      let temp_user_upvotes = doc.data().user_upvotes;
      return foodItem.update({user_upvotes: temp_user_upvotes.filter(user_id => user_id !== context.auth.uid)});
      //throw new functions.https.HttpsError('failed-precondition', 'user cannot upvote more than once.');
    }
    // update fooditem.user_upvotes array
    return foodItem.update({
      user_upvotes: [...doc.data().user_upvotes, context.auth.uid]
    }).then(() => {
      //check if user has downvoted (in that case, remove downvote)
      if (doc.data().user_downvotes.includes(context.auth.uid)) {
        let temp_user_downvotes = doc.data().user_downvotes;
        return foodItem.update({user_downvotes: temp_user_downvotes.filter(user_id => user_id !== context.auth.uid)})
      }
    });
  });
});

// ===================== DOWNVOTE ====================
exports.downvote = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
  const foodItem = admin.firestore().collection('fooditems').doc(data);
  return foodItem.get().then(doc => {
    // check if user has downvoted already (in that case -> remove downvote status)
    if (doc.data().user_downvotes.includes(context.auth.uid)) {
      let temp_user_downvotes = doc.data().user_downvotes;
      return foodItem.update({user_downvotes: temp_user_downvotes.filter(user_id => user_id !== context.auth.uid)})
      //throw new functions.https.HttpsError('failed-precondition', 'user cannot downvote more than once.');
    }
    // update fooditem.user_downvotes array
    return foodItem.update({
      user_downvotes: [...doc.data().user_downvotes, context.auth.uid]
    }).then(() => {
      // check if user has upvoted (in that case, remove upvote)
      if (doc.data().user_upvotes.includes(context.auth.uid)) {
        let temp_user_upvotes = doc.data().user_upvotes;
        return foodItem.update({user_upvotes: temp_user_upvotes.filter(user_id => user_id !== context.auth.uid)})
      }
    });
  });
});

// ===================== FAVORITE ========================
exports.favorite = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
  const foodItem = admin.firestore().collection('fooditems').doc(data);

  return foodItem.get().then(doc => {
    // check if user has favorited already
    if (doc.data().user_favorites.includes(context.auth.uid)) {
      let temp_user_favorites = doc.data().user_favorites;
      return foodItem.update({user_favorites: temp_user_favorites.filter(user_id => user_id !== context.auth.uid)})
      //throw new functions.https.HttpsError('failed-precondition', 'user cannot favorite more than once.');
    }
    // update fooditem.user_favorites array
    return foodItem.update({
      user_favorites: [...doc.data().user_favorites, context.auth.uid]
    });
  });
});

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
