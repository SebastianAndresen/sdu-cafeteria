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

// ===================== SET NOTIFICATIONS ========================
exports.setNotifications = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }

    // DO NOTIFICATION STUFF HERE
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
