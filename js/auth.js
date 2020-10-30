const user_span = document.querySelector('#user_id')
let user ='';

auth.signInAnonymously().catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorMessage, errorCode);
    // ...
});
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        user = firebaseUser.uid;
        //console.log(firebaseUser);
        console.log('Hello anonymous user: ' + firebaseUser.uid);
        user_span.innerHTML = `Username: ${firebaseUser.uid}`;
        db.collection('users').doc(firebaseUser.uid).set({
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

        db.collection('users').where(firebase.firestore.FieldPath.documentId(),'==', firebaseUser.uid).get().then(snapshot => {

            setupUserInfo(snapshot.docs)
        });
    } else {
        console.log('User logged out.');
    }
});

document.getElementById('btnLogout').addEventListener('click', e => {
    firebase.auth().signOut();
});
