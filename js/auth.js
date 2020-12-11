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
        /*const addToken = firebase.app().functions('europe-west1').httpsCallable('addToken');
        messaging.requestPermission()
            .then(() => {
                console.log('Permission obtained.');
                return messaging.getToken();
            })
            .then((token) => {
                console.log('token:', token);
                //save token to current user.
                console.log('trying to add token to user:', user);
                addToken(token);
                /!*db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
                    if (doc.exists) {
                        addToken(token);
                    } else {
                        console.log('user doesnt exist yet');
                    }

                }).catch(err => console.log('error setting token:', err));*!/
                //BUG: renderuser runs before data is available - to add token to user needs 2x refresh.
                //To fix: look into properly implementing promises or using async/await.
            })
            .catch(err => {
                console.log('Error: ', err);
            });*/

    } else {
        console.log('User logged out.');
    }
});
const deleteUser = firebase.app().functions('europe-west1').httpsCallable('deleteUser');
document.getElementById('btnLogout').addEventListener('click', e => {
    //delete user and token stuff
    console.log('deleting user:', user);
    messaging.deleteToken()
        .then((token) => {
            console.log('deleted token: ', token, ' from user: ', user)
        })
        .then(deleteUser())
        .then(auth.signOut())
        .catch(err => console.log(err));
    //firebase.auth().signOut();
    console.log('logged out..');
});
