
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

const renderFoodItem = (data, id) => {
    if (data.visible == 0 || data.visible == 2) return;

    const isUpvoted = data.user_upvotes.includes(user);
    const isDownvoted = data.user_downvotes.includes(user);
    const isFavorite = data.user_favorites.includes(user);

    const jsoncontent = {
        category: data.category,
        title: data.title,
        image: data.image,
        price: data.price,
        desc: data.desc,
        contains: data.contains,
        upvotes: data.user_upvotes.length,
        downvotes: data.user_downvotes.length,
        score: ((data.user_upvotes.length + data.user_downvotes.length) > 0 ? (Math.floor(data.user_upvotes.length / (data.user_upvotes.length + data.user_downvotes.length) * 100) / 10) : '-'),
        personal: {
            upvote: data.user_upvotes.includes(user),
            downvote: data.user_downvotes.includes(user),
            favorite: data.user_favorites.includes(user)
        }
    };

    const html = `
    <div class="fooditem" data-id="ID_${id}" id="ID_${id}" data-jsoncontent='${JSON.stringify(jsoncontent)}'>
        <img src="${data.image}" alt="${data.title} image">
        <div>
            <div class="food-title card-data">${data.title}</div>
            <div class="food-price card-data">${data.price}</div>
            <div class="food-ingredients card-data">${containsIntArrToStringArr(data.contains)}</div>
            
            <div class="food-upvotes card-data">Upvotes: ${data.user_upvotes.length}</div>
            <div class="food-downvotes card-data">Downvotes: ${data.user_downvotes.length}</div>
            
            <i class="btn_upvote card-data material-icons${isUpvoted ? ' active' : ''}" data-id="${id}" data-upvoted="${isUpvoted}">arrow_circle_up</i>
            <i class="btn_downvote card-data material-icons${isDownvoted ? ' active' : ''}" data-id="${id}" data-downvoted="${isDownvoted}">arrow_circle_down</i>
            <i class="btn_favorite card-data material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
        </div>
    </div>
    `;

    if (isFavorite)
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
    if (!data.visible) return;

    const fooditem = document.querySelector(`.fooditem[data-id=ID_${id}]`);
    // TODO - update image
    fooditem.querySelector('.food-title').innerHTML = data.title;
    fooditem.querySelector('.food-ingredients').innerHTML = containsIntArrToStringArr(data.contains);
    fooditem.querySelector('.food-price').innerHTML = data.price;
    fooditem.querySelector('.food-upvotes').innerHTML = `Upvotes: ${data.user_upvotes.length}`;
    fooditem.querySelector('.food-downvotes').innerHTML = `Downvotes: ${data.user_downvotes.length}`;

    const isUpvoted = data.user_upvotes.includes(user);
    const isDownvoted = data.user_downvotes.includes(user);
    const isFavorite = data.user_favorites.includes(user);

    const btnUpvote = fooditem.querySelector('.btn_upvote');
    const btnDownvote = fooditem.querySelector('.btn_downvote');
    const btnFavorite = fooditem.querySelector('.btn_favorite');

    //fooditem.querySelector('.btn_upvote').setAttribute('data-upvoted', isUpvoted).classList.remove("active").classList.add(isUpvoted ? 'active':'');

    btnUpvote.setAttribute('data-upvoted', isUpvoted);
    btnDownvote.setAttribute('data-downvoted', isDownvoted);
    btnFavorite.setAttribute('data-favorite', isFavorite);

    btnUpvote.classList.remove("active");
    btnDownvote.classList.remove("active");
    btnFavorite.classList.remove("active");

    if (isUpvoted) btnUpvote.classList.add("active");
    if (isDownvoted) btnDownvote.classList.add("active");
    if (isFavorite) btnFavorite.classList.add("active");
    /*
    if (isFavorite) {
        btnFavorite.classList.add("active");
    }
    else{
        removeFavorite(id);
    }*/
}
