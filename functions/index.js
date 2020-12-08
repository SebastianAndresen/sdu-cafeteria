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
    console.log(context.auth.uid);
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

// ===================== SET FILTERS ========================
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

exports.addToken = functions.https.onCall(((data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');

    return admin.firestore().collection('users').doc(context.auth.uid).update({
        token: data
    });
}));

// ===================== SUBSCRIBE ========================
exports.subToTopic = functions.https.onCall((data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');

    admin.messaging().subscribeToTopic(data.token, data.topic)
        .then(() => console.log(`subscribed ${context.auth.uid} to ${data.topic}`))
        .catch(err => console.log('error subscribing to topic: ', err))
    ;
});

// ===================== UNSUBSCRIBE ========================
exports.unSubFromTopic = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    admin.messaging().unsubscribeFromTopic(data.token, data.topic)
        .then(() => console.log(`unsubscribed ${context.auth.uid} from ${data.topic}`))
        .catch(err => console.log('error unsubscribing from topic: ', err))
});

// sends message when fooditem is created to all subscribers to topic 'favorites' [DEVELOPMENT]
// ===================== SEND PUSH NOTIFICATIONS ========================
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
        //console.log(context);
        const dataAfter = change.after.data();
        const dataBefore = change.before.data();
        let meal_flag;
        let condition;
        // if the updated data isn't changing visibility (and the change isn't setting visibility to 1, return null
        if (dataAfter.visible === dataBefore.visible || dataAfter.visible !== 1) {
            console.log('we are only interested in events where visibility changes to 1..');
            return null;
        }
        let vegetarian = [4, 7, 8]; // restrictions: shellfish, fish, meat
        let vegan = [0, 1, ...vegetarian]; //restrictions: dairy, eggs + vegetarian
        if (vegan.some(restriction => dataAfter.contains.includes(restriction))) {
            //fooditem contains at least one of 0,1,4,7,8 = vegan
            meal_flag = 'vegan';
            if (!vegetarian.some(restriction => dataAfter.contains.includes(restriction))) {
                //fooditem does not contain 0,1 - but does have at least one of 4,7,8 = vegetarian
                condition = "'vegetarian' in topics";
                meal_flag = 'vegetarian';
            }
        } else {
            //condition = "'favorites' in topics || 'vegetarian' in topics || 'vegan' in topics";
            condition = "'vegetarian' in topics || 'vegan' in topics";
        }
        //firestore.getAll() apparently doesn't work for JS. see https://cambaughn.medium.com/firestore-use-promise-all-instead-of-getall-on-the-web-301f4678bd05
        /**
         * for each id in fooditem.user_favorited
         *      if collection('users').doc(id).contains a token AND that user has notification['favorites']:
         *      send message to that token: "your favorite meal is available!"
         */
        const getUsers = (user_ids, cb) => {
            let refs = user_ids.map(id => {
                return admin.firestore().collection('users').doc(id).get();
            });
            Promise.all(refs)
                .then(docs => {
                    let users = docs.filter(doc => {
                        return doc.data().notifications.includes('favorites') && doc.data().token !== null;
                    }).map(user => {
                        return user.data().token
                    });
                    cb(users);
                })
                .catch(e => console.log(e));
        };
        getUsers(dataAfter.user_favorites, users => {
            console.log('user tokens to send a push notification to: ', users);
            let msg = {
                data: {
                    title: `Your favorite meal >>${dataAfter.title}<< is on todays menu!`,
                    body: `For just ${dataAfter.price}, come enjoy your favorite meal in the cafeteria from 11.00!`,
                    image: dataAfter.image,
                    icon: dataAfter.image
                },
                tokens: users,
            };
            admin.messaging().sendMulticast(msg)
                .then((response) => {
                    console.log(response.successCount + ' messages were sent successfully');
                });
        });

        const message = {
            data: {
                title: `On todays menu - ${dataAfter.title}`,
                body: meal_flag !== null?`For just ${dataAfter.price}, come enjoy your ${meal_flag} meal in the cafeteria from 11.00!`:`For just ${dataAfter.price}, come and try it!`,
                image: dataAfter.image,
                icon: dataAfter.image
            },
            condition: condition
        };
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    });
