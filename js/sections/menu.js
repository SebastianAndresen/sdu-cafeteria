
const fooditems = document.querySelector('#food_items');

const foodcategoriesDOM = [
    document.querySelector('#food_category_news'),
    document.querySelector('#food_category_daily'),
    document.querySelector('#food_category_drinks')
];

const renderFoodItem = (data, id) => {
    if (data.visible == 0) return;

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
        score: ((data.user_upvotes.length + data.user_downvotes.length) > 4 ? (Math.floor(data.user_upvotes.length / (data.user_upvotes.length + data.user_downvotes.length) * 100) / 10) : '-'),
        personal: {
            upvote: data.user_upvotes.includes(user),
            downvote: data.user_downvotes.includes(user),
            favorite: data.user_favorites.includes(user)
        }
    };

    const html = `
    <div class="fooditem" data-id="${id}" id="${id}" data-jsoncontent='${JSON.stringify(jsoncontent)}'>
    <img src="${data.image}" alt="${data.title} image" onclick="openFoodSingle('${id}');">
   <div>
    <div class="food-title card-data">${data.title}</div>
    <div class="food-price card-data">${data.price}</div>
   
    <div class="food-upvotes card-data">Upvotes: ${data.user_upvotes.length}</div>
    <div class="food-downvotes card-data">Downvotes: ${data.user_downvotes.length}</div>

    <i class="btn_upvote card-data material-icons${isUpvoted ? ' active' : ''}" data-id="${id}" data-upvoted="${isUpvoted}">arrow_circle_up</i>
    <i class="btn_downvote card-data material-icons${isDownvoted ? ' active' : ''}" data-id="${id}" data-downvoted="${isDownvoted}">arrow_circle_down</i>
    <i class="btn_favorite card-data material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
   </div>
</div>
    `;

    if (data.category < foodcategoriesDOM.length)
        foodcategoriesDOM[data.category].innerHTML += html;
}

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

const modifyFoodItem = (data, id) => {
    if (!data.visible) return;

    const fooditem = document.querySelector(`.fooditem[data-id=${id}]`);
    // TODO - update image
    fooditem.querySelector('.food-title').innerHTML = data.title;
    fooditem.querySelector('.food-ingredients').innerHTML = data.contains;
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

const removeFoodItem = (id) => {
    const fooditem = document.querySelector(`.fooditem[data-id=${id}]`);
    if(fooditem!=null){
        fooditem.remove();
    }
}

const renderUser = (data, id) => {
    console.log(`User found! rendering ${id}`);
    let html =
        `<h5>${id}</h5>
         <p>${JSON.stringify(data, null, 20)}</p>`;
    userInfo.innerHTML = html;
};

const singleFoodWindow = document.getElementById('food_single');
const singleFoodCategory = document.getElementById('food_single_category');
const foodSingleTitle = document.getElementById('food_single_title');
const foodSingleImg = document.getElementById('food_single_img');
const foodSinglePrice = document.getElementById('food_single_price');
const foodSingleDesc = document.getElementById('food_single_desc');
const foodSingleContains = document.getElementById('food_single_contains');
const foodSingleScore = document.getElementById('food_single_score');
const foodSingleBtnUpvote = document.getElementById('food_single_upvote');
const foodSingleBtnDownvote = document.getElementById('food_single_downvote');
const foodSingleBtnFavorite = document.getElementById('food_single_favorite');

const foodcategories = [
    "Dish of The Day",
    "Cold Dishes",
    "Sandwiches",
    "Nordic Revival",
    "Grab'n Go",
    "Salad Bar",
    "Fruit",
    "Bake-of",
    "Snacks",
    "Drinks"
];

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
        res += `<div>${containsFoodString[int_arr[i]]}</div>`;
    }
    return res;
}

const openFoodSingle = (itemid) => {
    if(!(document.getElementById("filters").style.visibility === 'visible'|| document.getElementById("notifications").style.visibility === 'visible')){
        let itemdata = JSON.parse(document.getElementById(itemid).getAttribute('data-jsoncontent'));
        singleFoodCategory.innerHTML = (foodcategories[itemdata.category] || '-');
        foodSingleTitle.innerHTML = itemdata.title;
        foodSingleImg.src = itemdata.image;
        foodSinglePrice.innerHTML = itemdata.price;
        foodSingleDesc.innerHTML = itemdata.desc;
        foodSingleContains.innerHTML = containsIntArrToStringArr(itemdata.contains);
        foodSingleScore.innerHTML = itemdata.score;

        foodSingleBtnUpvote.innerHTML = itemdata.upvotes;
        foodSingleBtnDownvote.innerHTML = itemdata.downvotes;

        itemdata.personal.upvote ? foodSingleBtnUpvote.classList.add('active') : foodSingleBtnUpvote.classList.remove('active');
        itemdata.personal.downvote ? foodSingleBtnDownvote.classList.add('active') : foodSingleBtnDownvote.classList.remove('active');
        itemdata.personal.favorite ? foodSingleBtnFavorite.classList.add('active') : foodSingleBtnFavorite.classList.remove('active');

        singleFoodWindow.classList.remove("singlehidden");
    };
};

const closeFoodSingle = () => {
    singleFoodWindow.classList.add("singlehidden");
}















//Functions that are currently not used

//cloudbased upvote function
/*const upvoteBtn = document.querySelector('.btn_upvote');
upvoteBtn.addEventListener('click', () => {
    const upvote = firebase.functions().httpsCallable('upvote');
    upvote().then(result => {
        console.log('upvoted!', result);
    });
});*/

/*
btn.addEventListener('click', () => {
    //get function reference
    const testCall = firebase.functions().httpsCallable('testCall');
    testCall().then(result => {
        window.location = result.data;
    });
});*/
