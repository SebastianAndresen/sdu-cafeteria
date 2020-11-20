console.log("NOTIFICATIONS SCRIPT LOADED v1");

const notifications = document.querySelector('#notifications');

notifications.addEventListener('click', evt => {
    if(evt.target.tagName=== 'INPUT'){

        const notifyVegan = firebase.app().functions('europe-west1').httpsCallable('notifyVegan');
        const notifyVegetarian = firebase.app().functions('europe-west1').httpsCallable('notifyVegetarian');
        const notifyFavorites = firebase.app().functions('europe-west1').httpsCallable('notifyFavorites');

        const id = evt.target.getAttribute('data-id');
        console.log(id);
        console.log(user);
        switch(evt.target.className.split(" ")[0]){
            case 'vegan':
                notifyVegan({
                    id,
                    notifyVegan
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'vegetarian':
                notifyVegetarian({
                    id,
                    notifyVegetarian
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'favorites':
                notifyFavorites({
                    id,
                    notifyFavorites
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            default:
                break;
        }
    }
});