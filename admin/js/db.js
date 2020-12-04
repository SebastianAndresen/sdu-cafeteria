
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
            console.log("admin: food modified");
            // modifyFoodItem(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            // removeFoodItem(change.doc.id);
            console.log("admin: food removed");
        }
    });
});
