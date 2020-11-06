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
        setupUser(user);
    } else {
        console.log('User logged out.');
    }
});

document.getElementById('btnLogout').addEventListener('click', e => {
    firebase.auth().signOut();
    console.log('logged out..');
});
