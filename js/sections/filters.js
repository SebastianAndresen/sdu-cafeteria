console.log("FILTERS SCRIPT LOADED v1");

const filters = document.querySelector('#filters');

filters.addEventListener('click', evt => {
    const filterVegan = firebase.app().functions('europe-west1').httpsCallable('EU_filterVegan');
    const filterVegetarian = firebase.app().functions('europe-west1').httpsCallable('EU_filterVegetarian');
    const filterHalal = firebase.app().functions('europe-west1').httpsCallable('EU_filterHalal');
    const filterShellFish = firebase.app().functions('europe-west1').httpsCallable('EU_filterNuts');
    const filterNuts = firebase.app().functions('europe-west1').httpsCallable('EU_filterShellFish');

    const id = evt.target.getAttribute('data-id');
    console.log(id);
    console.log(user);
    switch(evt.target.className.split(" ")[0]){
        case 'vegan':
            filterVegan({
                id,
                filteredVegan
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        case 'vegetarian':
            filterVegetarian({
                id,
                filteredVegetarian
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        case 'halal':
            filterHalal({
                id,
                filteredHalal
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        case 'shell-fish':
            filterShellFish({
                id,
                filteredShellFish
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        case 'nuts':
            filterNuts({
                id,
                filteredNuts
            }).catch(err => {
                //TODO: make nice and shiny error message for user
                console.log('ERROR: ', err.message);
            });
            break;
        default:
            break;
    }
});