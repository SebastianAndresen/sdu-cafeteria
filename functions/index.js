const functions = require('firebase-functions').region('europe-west1');
const admin = require('firebase-admin');
admin.initializeApp();

const userObj = {
    admin: false,
    filters: [],
    notifications: [],
    favorites: []
};

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

    return admin.firestore().collection('fooditems').add(data).then(function () {
        console.log("Fooditem was successfully written from editor!");
    }).catch(function (error) {
        console.error("Error creating food document: ", error);
    });
});

exports.adminupdateitem = functions.https.onCall((data, context) => {
    // check if authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
    }

    return admin.firestore().collection('fooditems').doc(data.id).update(data.json)
        .catch(function (error) {
            console.error("Error updating food document: ", error);
        });
});

exports.adminresetscore = functions.https.onCall((data, context) => {
    // check if authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
    }

    return admin.firestore().collection('fooditems').doc(data.id).set({
        user_downvotes: [],
        user_upvotes: [],
        lastreset: data.edittime,
        lastedit: data.edittime
    }, {merge: true}).catch(function (error) {
        console.error("Error resetting food score: ", error);
    });
});

exports.adminshowitem = functions.https.onCall((data, context) => {
    // check if authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
    }

    return admin.firestore().collection('fooditems').doc(data.id).set({
        visible: 1,
        lastedit: data.edittime
    }, {merge: true}).catch(function (error) {
        console.error("Error updating food visibility: ", error);
    });
});

exports.adminhideitem = functions.https.onCall((data, context) => {
    // check if authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');
    }

    return admin.firestore().collection('fooditems').doc(data.id).set({
        visible: 0,
        lastedit: data.edittime
    }, {merge: true}).catch(function (error) {
        console.error("Error updating food visibility: ", error);
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

// DELETE USER
exports.deleteUser = functions.https.onCall((data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated.');

    return admin.firestore().collection('users').doc(context.auth.uid).delete();
});

exports.addToken = functions.https.onCall(((data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');

    return admin.firestore().collection('users').doc(context.auth.uid).update({
        token: data
    }).then(console.log(`Successfully added token: ${data} to user: ${context.auth.uid}`))
        .catch(err => console.log(err));
}));

// ===================== SUBSCRIBE ========================
//called when user checks notification topic
exports.subToTopic = functions.https.onCall((data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');

    return admin.messaging().subscribeToTopic(data.token, data.topic)
        .then(() => {
            console.log(`subscribed ${context.auth.uid} to ${data.topic} and added token: ${data.token}`);
        })
        .catch(err => console.log('error subscribing to topic: ', err));
});

// ===================== UNSUBSCRIBE ========================
//called when user un-checks notification
exports.unSubFromTopic = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'user is not authenticated');
    }
    return admin.messaging().unsubscribeFromTopic(data.token, data.topic)
        .then(() => console.log(`unsubscribed ${context.auth.uid} from ${data.topic}`))
        .catch(err => console.log('error unsubscribing from topic: ', err))
});

// ===================== SEND PUSH NOTIFICATIONS ========================
//listens on every fooditem update
exports.broadcast = functions.firestore.document('fooditems/{fooditemID}')
    .onUpdate((change, context) => {
        const dataAfter = change.after.data();
        const dataBefore = change.before.data();
        const vegetarian = [4, 7, 8]; // restrictions: shellfish, fish, meat
        const vegan = [0, 1, ...vegetarian]; //restrictions: dairy, eggs + vegetarian
        let meal_flag, condition;

        // if the updated data isn't changing visibility (and the change isn't setting visibility to 1, return null
        if (dataAfter.visible === dataBefore.visible || dataAfter.visible !== 1) return null;

        if (vegan.some(restriction => dataAfter.contains.includes(restriction))) {
            //fooditem contains at least one of 0,1,4,7,8 = vegan
            if (!vegetarian.some(restriction => dataAfter.contains.includes(restriction))) {
                //fooditem does not contain 0,1 - but does have at least one of 4,7,8 = vegetarian
                condition = "'vegetarian' in topics";
                meal_flag = 'vegetarian';
            }
        } else {
            condition = "'vegetarian' in topics || 'vegan' in topics";
            meal_flag = 'vegan';
        }

        const getUsers = (user_ids, cb) => {
            let refs = user_ids.map(id => {
                return admin.firestore().collection('users').doc(id).get();
            });
            Promise.all(refs)
                .then(docs => {
                    let users = docs.filter(doc => {
                        if (!doc.exists) return false;
                        return doc.data().notifications.includes('favorites') && doc.data().token !== null;
                    }).map(user => {
                        return user.data().token
                    });
                    cb(users);
                })
                .catch(e => console.log(e));
        };
        getUsers(dataAfter.user_favorites, users => {
            if (!users.length) return false;
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
            return admin.messaging().sendMulticast(msg)
                .then((response) => {
                    console.log(response.successCount + ' messages were sent successfully');
                });
        });

        const message = {
            data: {
                title: `On todays menu - ${dataAfter.title}`,
                body: meal_flag !== null ? `For just ${dataAfter.price}, come enjoy your ${meal_flag} meal in the cafeteria from 11.00!` : `For just ${dataAfter.price}, come and try it!`,
                image: dataAfter.image,
                icon: dataAfter.image
            },
            condition: condition
        };
        return admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    });
