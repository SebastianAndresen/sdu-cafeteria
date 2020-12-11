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

// food-items real-time listener
const foodItemCollection = 'fooditems';
db.collection(foodItemCollection).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderFoodItem(change.doc.data(), change.doc.id);
            renderFavoriteItem(change.doc.data(), change.doc.id);
        }
        if (change.type === 'modified') {
            modifyFoodItem(change.doc.data(), change.doc.id);
            modifyFavoriteItem(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            removeFoodItem(change.doc.id);
        }
    });
});