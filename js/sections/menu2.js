
const fooditems = document.querySelector('#food_items');

const foodcategoriesDOM = [
    document.querySelector('#food_category_daily'),
    document.querySelector('#food_category_cold'),
    document.querySelector('#food_category_sandwich'),
    document.querySelector('#food_category_nordic'),
    document.querySelector('#food_category_grab'),
    document.querySelector('#food_category_salad'),
    document.querySelector('#food_category_fruit'),
    document.querySelector('#food_category_baking'),
    document.querySelector('#food_category_snack'),
    document.querySelector('#food_category_drink')
];

const buildFoodJSONfile = (data) => {
    const votes = data.user_upvotes.length + data.user_downvotes.length;
    const upvotes = data.user_upvotes.length;
    const downvotes = data.user_downvotes.length;
    return {
        category: data.category,
        title: data.title,
        image: data.image,
        price: data.price,
        contains: data.contains,
        votes,
        upvotes,
        downvotes,
        score: (votes > 0 ? (Math.floor(upvotes / (votes) * 100) / 10) : '-'),
        personal: {
            upvote: data.user_upvotes.includes(user),
            downvote: data.user_downvotes.includes(user),
            favorite: data.user_favorites.includes(user)
        }
    };
};

const renderFoodItem = (data, id) => {
    if (data.visible == 0 || data.visible == 2) return;

    const foodJSON = buildFoodJSONfile(data);

    const html = `
    <div class="fooditem" data-id="ID_${id}" id="ID_${id}" data-jsoncontent='${JSON.stringify(foodJSON)}'>
        <img src="${foodJSON.image}" alt="${foodJSON.title} image">

        <div class="food-title card-data">${foodJSON.title}</div>
        <div class="food-price card-data">${foodJSON.price}</div>
        <div class="food-ingredients card-data">${containsIntArrToStringArr(foodJSON.contains)}</div>
        
        <div class="food-upvotes card-data">Upvotes: ${foodJSON.upvotes}</div>
        <div class="food-downvotes card-data">Downvotes: ${foodJSON.downvotes}</div>

        <div class="food-votes card-data">Votes: ${foodJSON.votes}</div>
        <div class="food-score card-data">Score: ${foodJSON.score}</div>
        
        <i class="btn_upvote card-data material-icons${foodJSON.personal.upvote ? ' active' : ''}" data-id="${id}" data-upvoted="${foodJSON.personal.upvote}">arrow_circle_up</i>
        <i class="btn_downvote card-data material-icons${foodJSON.personal.downvote ? ' active' : ''}" data-id="${id}" data-downvoted="${foodJSON.personal.downvote}">arrow_circle_down</i>
        <i class="btn_favorite card-data material-icons${foodJSON.personal.favorite ? ' active' : ''}" data-id="${id}" data-favorite="${foodJSON.personal.favorite}">star_rate</i>
    </div>
    `;

    if (foodJSON.personal.favorite)
        renderFavoriteItem(data, id);

    if (data.category < foodcategoriesDOM.length)
        foodcategoriesDOM[data.category].innerHTML += html;
};

fooditems.addEventListener('click', evt => {
    const upvote = firebase.app().functions('europe-west1').httpsCallable('upvote');
    const downvote = firebase.app().functions('europe-west1').httpsCallable('downvote');
    const favorite = firebase.app().functions('europe-west1').httpsCallable('favorite');
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        switch (evt.target.className.split(" ")[0]) {
            case 'btn_upvote':
                const upvoted = evt.target.getAttribute('data-upvoted') == 'true';
                upvote({
                    id,
                    upvoted
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'btn_downvote':
                const downvoted = evt.target.getAttribute('data-downvoted') == 'true';
                downvote({
                    id,
                    downvoted
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR:', err.message);
                });
                break;
            case 'btn_favorite':
                const favorited = evt.target.getAttribute('data-favorite') == 'true';
                favorite({
                    id,
                    favorited
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR:', err.message);
                });
                break;
            default:
                console.log(`Unknown class: ${evt.target.className.split(" ")[0]}`);
        }
    }
});

const containsFoodString = [
    'Dairy',
    'Eggs',
    'Tree nuts',
    'Peanuts',
    'Shellfish',
    'Wheat',
    'Soy',
    'Fish',
    'Any Meat',
    'Non-Halal Meat',
    'Any Sugar',
    'High Sugar Content',
    'Any Gluten',
    'High Gluten Content',
    'Any Calories',
    'High Calories Content'
];

const containsIntArrToStringArr = (int_arr) => {
    let res = '';
    for (let i = 0; i < int_arr.length; i++) {
        if ([8, 10, 12, 14].includes(int_arr[i])) continue;
        res += `<div>${containsFoodString[int_arr[i]]}</div>`;
    }
    return res;
}

const modifyFoodItem = (data, id) => {
    if (data.visible == 0 || data.visible == 2) {
        // TODO: REMOVE FOODITEM IF IT IS VISIBLE ALREADY
        return;
    } else {
        // TODO: ADD FOODITEM IF IT IS NOT VISIBLE ALREADY
    }

    const foodJSON = buildFoodJSONfile(data);

    const fooditem = document.querySelector(`.fooditem[data-id=ID_${id}]`);

    const btnUpvote = fooditem.querySelector('.btn_upvote');
    const btnDownvote = fooditem.querySelector('.btn_downvote');
    const btnFavorite = fooditem.querySelector('.btn_favorite');

    // TODO - update image
    fooditem.querySelector('.food-title').innerHTML = foodJSON.title;
    fooditem.querySelector('.food-ingredients').innerHTML = containsIntArrToStringArr(foodJSON.contains);
    fooditem.querySelector('.food-price').innerHTML = foodJSON.price;
    fooditem.querySelector('.food-upvotes').innerHTML = `Upvotes: ${foodJSON.upvotes}`;
    fooditem.querySelector('.food-downvotes').innerHTML = `Downvotes: ${foodJSON.downvotes}`;
    fooditem.querySelector('.food-votes').innerHTML = `Votes: ${foodJSON.votes}`;
    fooditem.querySelector('.food-score').innerHTML = `Score: ${foodJSON.score}`;

    btnUpvote.setAttribute('data-upvoted', foodJSON.personal.upvote);
    btnDownvote.setAttribute('data-downvoted', foodJSON.personal.downvote);
    btnFavorite.setAttribute('data-favorite', foodJSON.personal.favorite);

    btnUpvote.classList.remove("active");
    btnDownvote.classList.remove("active");
    btnFavorite.classList.remove("active");

    if (foodJSON.personal.upvote) btnUpvote.classList.add("active");
    if (foodJSON.personal.downvote) btnDownvote.classList.add("active");
    if (foodJSON.personal.favorite) btnFavorite.classList.add("active");
}
