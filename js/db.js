// offline data
console.log(user);
db.enablePersistence()
    .catch(err => {
        if (err.code === 'failed-precondition') {
            //probably multiple open tabs
            console.log('persistence failed (close other open tabs)');
        } else if (err.code === 'unimplemented') {
            //lack of browser support
            console.log('persistence is not available');
        }
    });

// real-time listener
db.collection('recipes').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), change.doc.id);
        if (change.type === 'added') {
            // add document data to web page
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            // remove document data from web page
            removeRecipe(change.doc.id);
        }
    });
});

/** ********** **/
/** FOOD ITEMS **/
/** ********** **/

const foodItemCollection = 'fooditems';

// food-items real-time listener
db.collection(foodItemCollection).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderFoodItem(change.doc.data(), change.doc.id);
        }
        if (change.type === 'modified') {
            modifyFoodItem(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            removeFoodItem(change.doc.id);
        }
    });
});

const clickUpvote = (itemid, isUpvoted) => {
    if (isUpvoted) {
        db.collection(foodItemCollection).doc(itemid).update({
            user_upvotes: firebase.firestore.FieldValue.arrayRemove(user)
        });
    } else {
        db.collection(foodItemCollection).doc(itemid).update({
            user_upvotes: firebase.firestore.FieldValue.arrayUnion(user),
            user_downvotes: firebase.firestore.FieldValue.arrayRemove(user)
        });
    }
};

const clickDownvote = (itemid, isDownvoted) => {
    if (isDownvoted) {
        db.collection(foodItemCollection).doc(itemid).update({
            user_downvotes: firebase.firestore.FieldValue.arrayRemove(user)
        });
    } else {
        db.collection(foodItemCollection).doc(itemid).update({
            user_downvotes: firebase.firestore.FieldValue.arrayUnion(user),
            user_upvotes: firebase.firestore.FieldValue.arrayRemove(user)
        });
    }
};

const clickFavorite = (itemid, isFavorite) => {
    if (isFavorite) {
        db.collection(foodItemCollection).doc(itemid).update({
            user_favorites: firebase.firestore.FieldValue.arrayRemove(user)
        });
    } else {
        db.collection(foodItemCollection).doc(itemid).update({
            user_favorites: firebase.firestore.FieldValue.arrayUnion(user)
        });
    }
};

/** **** **/
/** USER **/
/** **** **/

/*const setupUserDBListener = (uid) => {
    console.log("Listen to user");
    db.collection('users').doc(uid).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "modified") {
                console.log("Modified User: ", change.doc.data());
            }
        });
    });
};*/

const setupUser = (uid) => {
    const ref = db.collection('users').where(firebase.firestore.FieldPath.documentId(), '==', uid);
    ref.onSnapshot(snapshot => {
        //let userData = snapshot.docs.find(doc => doc.id === user).data();
        console.log(`Logging data of user: ${uid}`);
        //console.log(snapshot);
        console.log(snapshot.docs.find(doc => doc.id === uid).data());
        renderUser(snapshot.docs.find(doc => doc.id === uid).data(), uid);
        //console.log(snapshot);
    });
};
/*const query = db.collection('users').where(firebase.firestore.FieldPath.documentId(), '==', '21FLtA2xlbRU9wDXjheAxE5TlgJ3');

const observer = query.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    // ...
}, err => {
    console.log(`Encountered error: ${err}`);
});*/

/*


const doc = db.collection('users').where(firebase.firestore.FieldPath.documentId(),'==', user);
doc.onSnapshot(snapshot => {

    console.log('current user:', user);
    console.log(snapshot);
});
*/
