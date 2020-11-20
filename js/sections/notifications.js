console.log("NOTIFICATIONS SCRIPT LOADED v1");

const notifications = document.querySelector('#notifications');

notifications.addEventListener('click', evt => {
    const notifyVegan = firebase.app().functions('europe-west1').httpsCallable('EU_notifyVegan');
    const notifyVegetarian = firebase.app().functions('europe-west1').httpsCallable('EU_notifyVegetarian');
    const notifyFavorites = firebase.app().functions('europe-west1').httpsCallable('EU_notifyFavorites');

    const id = evt.target.getAttribute('data-id');
    console.log(id);
    console.log(user);
    switch(evt.target.className.split(" ")[0]){
        case 'vegan':
            notifyVegan({
                id,
                notifiedVegan
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        case 'vegetarian':
            notifyVegetarian({
                id,
                notifiedVegetarian
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        case 'favorites':
            notifyFavorites({
                id,
                notifiedFavorites
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        default:
            break;
    }
});