const user_span = document.querySelector('#user_id')
let user ='';

auth.signInAnonymously().catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorMessage, errorCode);
    // ...
});

auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.

        let uid = user.uid;
        user_span.innerHTML = `Username: ${uid}`;
        let docRef = db.collection('users');
        //console.log(uid);
        console.log(user.isAnonymous)
        docRef.doc(uid).get().then(doc => {
            if (doc.exists) {
                console.log('Document data', doc.data());
            } else {
                docRef.doc(uid).set({
                    diet: {
                        vegan: false,
                        vegetarian: false,
                        halal: false
                    },
                    allergies: {
                        nuts: false,
                        shellfish: false,
                    },
                    notifications: {
                        favorites: false,
                        vegan: false,
                        vegetarian: false,
                        halal: false
                    },
                    favorites: {}
                })
                console.log('no such data - creating it now!');
            }
        }).catch(e => {
            console.error(e);
        });
        // ...
    } else {
        // User is signed out.
        // ...
    }
    // ...
});
/*
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        user = auth.currentUser;
        console.log(user.uid);
        console.log('Hello anonymous user: ' + firebaseUser.uid);
        user_span.innerHTML = `Username: ${firebaseUser.uid}`;
        /!*if (!db.collection('users').doc(user.id)) {*!/
            db.collection('users').doc(user.uid).set({
                diet: {
                    vegan: false,
                    vegetarian: false,
                    halal: false
                },
                allergies: {
                    nuts: false,
                    shellfish: false,
                },
                notifications: {
                    favorites: false,
                    vegan: false,
                    vegetarian: false,
                    halal: false
                },
                favorites: {}
            });
        //}


        db.collection('users').where(firebase.firestore.FieldPath.documentId(),'==', firebaseUser.uid).get().then(snapshot => {

            setupUserInfo(snapshot.docs)
        });
    } else {
        console.log('User logged out.');
    }
});
*/

document.getElementById('btnLogout').addEventListener('click', e => {
    firebase.auth().signOut();
});
