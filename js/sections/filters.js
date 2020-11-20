console.log("FILTERS SCRIPT LOADED v1");

const filters = document.querySelector('#filters');

filters.addEventListener('click', evt => {
    if(evt.target.tagName=== 'INPUT'){
        const filterVegan = firebase.app().functions('europe-west1').httpsCallable('filterVegan');
        const filterVegetarian = firebase.app().functions('europe-west1').httpsCallable('filterVegetarian');
        const filterHalal = firebase.app().functions('europe-west1').httpsCallable('filterHalal');
        const filterShellFish = firebase.app().functions('europe-west1').httpsCallable('filterNuts');
        const filterNuts = firebase.app().functions('europe-west1').httpsCallable('filterShellFish');

        const id = evt.target.getAttribute('data-id');
        console.log(id);
        console.log(user);
        switch(evt.target.className.split(" ")[0]){
            case 'vegan':
                filterVegan({
                    id,
                    filterVegan
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'vegetarian':
                filterVegetarian({
                    id,
                    filterVegetarian
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'halal':
                filterHalal({
                    id,
                    filterHalal
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'shell-fish':
                filterShellFish({
                    id,
                    filterShellFish
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
    }
});