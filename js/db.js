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

// food-items real-time listener
db.collection('fooditems').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderFoodItem(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            removeFoodItem(change.doc.id);
        }
    });
});
