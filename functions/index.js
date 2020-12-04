const functions = require('firebase-functions').region('europe-west1');
const admin = require('firebase-admin');
admin.initializeApp();

const userObj = {
    admin: false,
    filters: [],
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
    console.log(data.id);
    console.log(context.auth.id);
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
    console.log(`subscribed ${context.auth.uid} to ${data.topic}`);
    return `subscribed ${context.auth.uid} to ${data.topic}`;
});

exports.unSubFromTopic = functions.https.onCall(((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    admin.messaging().unsubscribeFromTopic(data.token, data.topic);
     console.log(`unsubscribed ${context.auth.uid} from ${data.topic}`);
    return `unsubscribed ${context.auth.uid} from ${data.topic}`;
}));

// sends message when fooditem is created to all subscribers to topic 'favorites' [DEVELOPMENT]
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

exports.broadcast = functions.firestore.document('fooditems/{fooditemID}')
    //listens on every fooditem update
    .onUpdate((change, context) => {
        const dataAfter = change.after.data();
        const dataBefore = change.before.data();

        // if the updated data isn't changing visibility (and the change isn't setting visibility to 1, return null
        if (dataAfter.visible == dataBefore.visible || dataAfter.visible != 1) {
            console.log('we are only interested in events where visibility changes to 1..');
            return null;
        }
        /*
        dairy = 0
        eggs = 1,
        shellfish = 4
        fish = 7
        meat = 8
         */
        let vegetarian = [4, 7, 8]; // restrictions: shellfish, fish, meat
        let vegan = [0, 1, ...vegetarian]; //restrictions: dairy, eggs + vegetarian

        /**
         * testcases:
         * vegetarian: include any except 4,7,8
         * vegan: include 0 or 1
         */
        /*
        console.log('vegetarian must not include: ', vegetarian);
        console.log('vegan must not include: ', vegan);
        */
        if (vegan.some(restriction => dataAfter.contains.includes(restriction))) {
            //fooditem contains at least one of 0,1,4,7,8 = vegan
            console.log('this fooditem isnt vegan..');
            if (!vegetarian.some(restriction => dataAfter.contains.includes(restriction))) {
                //fooditem does not contain 0,1 - but does have at least one of 4,7,8 = vegetarian
                console.log('.. but it is vegetarian!');
            }
        } else console.log('this fooditem is neither vegan or vegetarian!');
        //if dataAfter.contains.includes()
        //console.log('visibility changed to 1!!');
        console.log('change before: ',change.before.data().visible);
        console.log('change after: ',change.after.data().visible);
        //const foodItem = snapshot.data();
        //const notification =
    });


