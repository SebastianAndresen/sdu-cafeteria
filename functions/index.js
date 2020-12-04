const functions = require('firebase-functions').region('europe-west1');
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

    if (data.upvoted) {
        return admin.firestore().collection('fooditems').doc(data.id).update({
            user_upvotes: admin.firestore.FieldValue.arrayRemove(context.auth.uid)
        });
    } else {
        return admin.firestore().collection('fooditems').doc(data.id).update({
            user_upvotes: admin.firestore.FieldValue.arrayUnion(context.auth.uid),
            user_downvotes: admin.firestore.FieldValue.arrayRemove(context.auth.uid)
        });
    }
});

// ===================== DOWNVOTE ====================
exports.downvote = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
    }

    if (data.downvoted) {
        return admin.firestore().collection('fooditems').doc(data.id).update({
            user_downvotes: admin.firestore.FieldValue.arrayRemove(context.auth.uid)
        });
    } else {
        return admin.firestore().collection('fooditems').doc(data.id).update({
            user_downvotes: admin.firestore.FieldValue.arrayUnion(context.auth.uid),
            user_upvotes: admin.firestore.FieldValue.arrayRemove(context.auth.uid)
        });
    }
});

// ===================== FAVORITE ========================
exports.favorite = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
    }

    if (data.favorited) {
        return admin.firestore().collection('fooditems').doc(data.id).update({
            user_favorites: admin.firestore.FieldValue.arrayRemove(context.auth.uid)
        });
    } else {
        return admin.firestore().collection('fooditems').doc(data.id).update({
            user_favorites: admin.firestore.FieldValue.arrayUnion(context.auth.uid)
        });
    }
});

// ===================== ADMIN FUNCTIONS ========================

exports.admincreatenew = functions.https.onCall((data, context) => {
  // check if authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }

  admin.firestore().collection('fooditems').add(data).then(function () {
    console.log("Fooditem was successfully written from editor!");
  }).catch(function (error) {
    console.error("Error creating food document: ", error);
  });
});

// ===================== SET NOTIFICATIONS ========================
exports.setNotifications = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    return admin.firestore().collection('users').doc(context.auth.uid).update({
        notifications: data
    });
});

exports.setFilters = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    return admin.firestore().collection('users').doc(context.auth.uid).update({
        filters: data
    });
});

// auth trigger (new user)
exports.newUser = functions.auth.user().onCreate(user => {
    console.log('creating user..', user.uid);
    return admin.firestore().collection('users').doc(user.uid).set(userObj)
});

// auth trigger (delete user)
exports.deleteUser = functions.auth.user().onDelete(user => {
    console.log('deleting user..', user.uid);
    const doc = admin.firestore().collection('users').doc(user.uid);
    return doc.delete();

});

exports.subToTopic = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    admin.messaging().subscribeToTopic(data.token, data.topic);
    return `subscribed ${context.auth.uid} to ${data.topic}`;
});

exports.unSubFromTopic = functions.https.onCall(((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    admin.messaging().unsubscribeFromTopic(data.token, data.topic);
    return `unsubscribed ${context.auth.uid} from ${data.topic}`;
}));

exports.broadcastToSubscribers = functions.firestore.document('fooditems/{fooditemId}')
    .onCreate(snapshot => {
        const fooditem = snapshot.data();
        const notification = admin.messaging.Notification = {
            title: 'New Fooditem Available!',
            body: fooditem.title
        }
        const payload = admin.messaging.Message = {
            notification,
            topic: 'favorites'
        }
        return admin.messaging().send(payload);
    });
/*exports.notifyVegan = functions.https.onCall((data, context) => {
  console.log('TODO: notify vegan')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.notifyVegetarian = functions.https.onCall((data, context) => {
  console.log('TODO: notify vegetarian')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.notifyFavorites = functions.https.onCall((data, context) => {
  console.log('TODO: notify favorites')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.filterVegan = functions.https.onCall((data, context) => {
  console.log('TODO: filter vegan')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.filterVegetarian = functions.https.onCall((data, context) => {
  console.log('TODO: filter vegetarian')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.filterNuts = functions.https.onCall((data, context) => {
  console.log('TODO: filter nuts')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.filterHalal = functions.https.onCall((data, context) => {
  console.log('TODO: filter halal')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});

exports.filterShellFish = functions.https.onCall((data, context) => {
  console.log('TODO: filter shell-fish')
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
  }
});*/

