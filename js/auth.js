const user_span = document.querySelector('#user_id');
let user ='';
let userobj = {
    admin: false,
    diet: [],
    allergies: [],
    notifications: [],
    favorites: []
};

auth.signInAnonymously().catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorMessage, errorCode);
    // ...
});

/*
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        user = firebaseUser.uid;
        //console.log(firebaseUser);
        console.log('Hello anonymous user: ' + firebaseUser.uid);
        user_span.innerHTML = `Username: ${firebaseUser.uid}`;

        db.collection('users').doc(user).get().then(doc => {
            if (doc.exists) {
                userobj = doc.data();
            } else {
                console.log(`Creating new user with id ${user}`);
                userobj = {
                    admin: false,
                    diet: [],
                    allergies: [],
                    notifications: [],
                    favorites: []
                };
                db.collection('users').doc(user).set(userobj);
            }
        });

        // TODO - remove this i guess ?
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
