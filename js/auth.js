let user = '';

auth.signInAnonymously().catch(function (error) {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorMessage, errorCode);
});

auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //create reference to user_id to be used elsewhere
        user = firebaseUser.uid;
        initFilters(user);
    } else {
        console.log('User logged out.');
    }
});

document.getElementById('btnLogout').addEventListener('click', e => {
    //delete user and token stuff
    firebase.auth().signOut();
    console.log('logged out..');
});
