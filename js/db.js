// offline data
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
}

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
}

const clickFavorite = (itemid, isFavorite) => {
    console.log(`USer ${user} favorites ${itemid} (DB)`);
}
