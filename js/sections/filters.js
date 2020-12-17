//Array for storing user filters
var filterArray = [];

const filters = document.querySelector('#filters');

//IDs of filter checkboxes
const filterID = [
    'filter_dairy',
    'filter_eggs',
    'filter_tree-nuts',
    'filter_peanuts',
    'filter_shellfish',
    'filter_wheat',
    'filter_soy',
    'filter_fish',
    'filter_meat',
    'filter_non-halal',
    'filter_any-sugar',
    'filter_high-sugar',
    'filter_any-gluten',
    'filter_high-gluten',
    'filter_any-calories',
    'filter_high-calories'
];

//Strings to be written to console
/*const consoleString = [
    'dairy',
    'eggs',
    'tree nuts',
    'peanuts',
    'shellfish',
    'wheat',
    'soy',
    'fish',
    'meat',
    'non-halal meat',
    'sugar',
    'lots of sugar',
    'gluten',
    'lots of gluten',
    'calories',
    'lots of calories'
];*/

//Initialize filter settings from database
const initFilters = (user) =>{
    const doc = db.collection("users").doc(user).get().then((snapshot)=>{
        try {
            filterArray = snapshot.data().filters;
            for( var i = 0; i < filterArray.length; i++){
                document.getElementById(filterID[filterArray[i]]).checked = true;
            }
            filterFunction(filterArray);
        } catch (error) {
            console.log("First login for this user.");
        }
        
    });
};

function filterFunction(array){
    const setFilters = firebase.app().functions('europe-west1').httpsCallable('setFilters');
    setFilters(array, user);
    
    const allfooditemsinfo = document.getElementsByClassName('fooditem');

    for (let i = 0; i < allfooditemsinfo.length; i++) {
        
        const foodJSON = JSON.parse(allfooditemsinfo[i].getAttribute('data-jsoncontent'));
        const carouselitem = document.querySelector(`.food_carousel_item[data-id=ID_${foodJSON.id}]`);

        allfooditemsinfo[i].classList.remove('filterhide');
        carouselitem.classList.remove('filterhide');

        for (let j = 0; j < filterArray.length; j++) {
            if (foodJSON.contains.includes(filterArray[j])) {
                allfooditemsinfo[i].classList.add('filterhide');
                carouselitem.classList.add('filterhide');
                break;
            }
        }
    }
};

function checkboxClicked(filterCat){
    //Get checkbox ID
    var checkbox = document.getElementById(filterID[filterCat]);

    //If checked => push to filterArray
    if(checkbox.checked === true ){
        filterArray.push(filterCat);
    }
    //If un-checked => remove from filterArray
    else{
        filterArray = filterArray.filter(e => e !== filterCat);
    }

    //Run filterfunction
    filterFunction(filterArray);
}























//Functions that are currently not used

/*
const renderFilterItem = (data, id) => {
    if (!data.visible) return;

    const isUpvoted = data.user_upvotes.includes(user);
    const isDownvoted = data.user_downvotes.includes(user);
    const isFavorite = data.user_favorites.includes(user);
    
    const html = `
        <div class="filteritem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="filter-title">${data.title}</div>
            <div class="food-price">${data.contains}</div>
            <div class="filter-price">${data.price}</div>

            <div class="filter-upvotes">Upvotes: ${data.user_upvotes.length}</div>
            <div class="filter-downvotes">Downvotes: ${data.user_downvotes.length}</div>

            <i class="btn_upvote material-icons${isUpvoted ? ' active' : ''}" data-id="${id}" data-upvoted="${isUpvoted}">arrow_circle_up</i>
            <i class="btn_downvote material-icons${isDownvoted ? ' active' : ''}" data-id="${id}" data-downvoted="${isDownvoted}">arrow_circle_down</i>
            <i class="btn_favorite material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
        </div>
    `;

    document.querySelector('#filtered').innerHTML += html;
}*/