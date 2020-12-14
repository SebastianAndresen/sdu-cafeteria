
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

const foodinfoDOM = [
    document.querySelector('#food_category_info_daily'),
    document.querySelector('#food_category_info_cold'),
    document.querySelector('#food_category_info_sandwich'),
    document.querySelector('#food_category_info_nordic'),
    document.querySelector('#food_category_info_grab'),
    document.querySelector('#food_category_info_salad'),
    document.querySelector('#food_category_info_fruit'),
    document.querySelector('#food_category_info_baking'),
    document.querySelector('#food_category_info_snack'),
    document.querySelector('#food_category_info_drink')
]

const buildFoodJSONfile = (data, id) => {
    const votes = data.user_upvotes.length + data.user_downvotes.length;
    const upvotes = data.user_upvotes.length;
    const downvotes = data.user_downvotes.length;
    return {
        id,
        category: data.category,
        title: data.title,
        image: data.image,
        price: data.price,
        contains: data.contains,
        votes,
        upvotes,
        downvotes,
        score: (votes > 0 ? (Math.floor(upvotes / (votes) * 100) / 10) : 0),
        personal: {
            upvote: data.user_upvotes.includes(user),
            downvote: data.user_downvotes.includes(user),
            favorite: data.user_favorites.includes(user)
        }
    };
};

const carouselContainers = document.querySelectorAll('.carousel');
const carouselOptions = {
    duration: 300,
    padding: 10,
    indicators: true,
    noWrap: true,
    fullWidth: true,
    onCycleTo: (ele) => {
        loadFoodItemContentIntoView(JSON.parse(ele.getAttribute('data-jsoncontent')));
    }
}

const loadFoodItemContentIntoView = (item) => {
    const allincategory = foodinfoDOM[item.category].children;
    for (let i = 0; i < allincategory.length; i++) {
        allincategory[i].classList.remove('active');
    }
    document.getElementById(`ID_${item.id}`).classList.add('active');
}

const reloadCarousels = () => {
    setTimeout(() => {
        M.Carousel.init(carouselContainers, carouselOptions);
    }, 100);
}

const renderFoodItem = (data, id) => {
    if (data.visible == 0 || data.visible == 2) return;
    if (data.category >= foodcategoriesDOM.length) return;

    const foodJSON = buildFoodJSONfile(data, id);

    const carouselHtml = `
    <div class="food_carousel_item carousel-item" data-id="ID_${id}" data-jsoncontent='${JSON.stringify(foodJSON)}'>
        <img src="${foodJSON.image}" alt="${foodJSON.title} image" onerror="this.src='data:image/jpeg;base64,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'">
        <div class="carousel_description">
            <div class="food-title">${foodJSON.title}</div>
            <div class="food-score-container">
                <span class="food-score">${foodJSON.votes > 4 ? foodJSON.score : '-'}</span>/10.0
            </div>
        </div>
    </div>
    `;

    const html = `
    <div class="fooditem foodcategory${foodJSON.category}" data-id="ID_${id}" id="ID_${id}" data-jsoncontent='${JSON.stringify(foodJSON)}'>
        <div class="food-info-img z-index-1">
            <img src="${foodJSON.image}" alt="${foodJSON.title} image" onerror="this.src='data:image/jpeg;base64,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'">
        </div>
        <div class="food-info-card">
            <table>
                <tr>
                    <td colspan="2" class="food-title">${foodJSON.title}</td>
                </tr>
                </tr>
                    <td class="food-description">
                        <div class="food-price">${foodJSON.price}</div>
                        <div class="food-ingredients">${containsIntArrToStringArr(foodJSON.contains)}</div>
                    </td>
                    <td rowspan="2" class="votebtn_container">
                        <div class="btn_upvote votebtn${foodJSON.personal.upvote ? ' active' : ''}">
                            <span class="btn_upvote_press vote_arrow" data-id="${id}" data-upvoted="${foodJSON.personal.upvote}">${foodJSON.personal.upvote ? '&#9650' : '&#9651'}</span>
                            <span class="btn_upvote_press vote_count" data-id="${id}" data-upvoted="${foodJSON.personal.upvote}">${foodJSON.upvotes}</span>
                        </div>
                        <div class="btn_downvote votebtn${foodJSON.personal.downvote ? ' active' : ''}">
                            <span class="btn_downvote_press vote_arrow" data-id="${id}" data-downvoted="${foodJSON.personal.downvote}">${foodJSON.personal.downvote ? '&#9660' : '&#9661'}</span>
                            <span class="btn_downvote_press vote_count" data-id="${id}" data-downvoted="${foodJSON.personal.downvote}">${foodJSON.downvotes}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="btn_favorite_container">
                            <i class="btn_favorite material-icons${foodJSON.personal.favorite ? ' active' : ''}" data-id="${id}" data-favorite="${foodJSON.personal.favorite}">grade</i>
                        </div>
                        <div class="food-score-container">
                            <span class="food-score">${foodJSON.votes > 4 ? foodJSON.score : '-'}</span>/10.0
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    `;

    if (foodJSON.personal.favorite)
        renderFavoriteItem(data, id);

    foodcategoriesDOM[data.category].innerHTML += carouselHtml;
    foodinfoDOM[data.category].innerHTML += html;
    
    reloadCarousels();
};

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

    const foodJSON = buildFoodJSONfile(data, id);

    const fooditem = document.querySelector(`.fooditem[data-id=ID_${id}]`);

    // TODO - update image
    fooditem.querySelector('.food-title').innerHTML = foodJSON.title;
    fooditem.querySelector('.food-ingredients').innerHTML = containsIntArrToStringArr(foodJSON.contains);
    fooditem.querySelector('.food-price').innerHTML = foodJSON.price;
    fooditem.querySelector('.food-score').innerHTML = foodJSON.votes > 4 ? foodJSON.score : '-';

    const btnUpvote = fooditem.querySelector('.btn_upvote');
    const btnDownvote = fooditem.querySelector('.btn_downvote');
    const btnFavorite = fooditem.querySelector('.btn_favorite');

    btnUpvote.classList.remove("active");
    btnDownvote.classList.remove("active");
    btnFavorite.classList.remove("active");

    if (foodJSON.personal.upvote) btnUpvote.classList.add("active");
    if (foodJSON.personal.downvote) btnDownvote.classList.add("active");
    if (foodJSON.personal.favorite) btnFavorite.classList.add("active");

    btnFavorite.setAttribute('data-favorite', foodJSON.personal.favorite);

    const upvotebtnArrow = btnUpvote.querySelector('.vote_arrow');
    const upvotebtnCount = btnUpvote.querySelector('.vote_count');
    upvotebtnArrow.setAttribute('data-upvoted', foodJSON.personal.upvote);
    upvotebtnCount.setAttribute('data-upvoted', foodJSON.personal.upvote);
    upvotebtnArrow.innerHTML = foodJSON.personal.upvote ? '&#9650' : '&#9651';
    upvotebtnCount.innerHTML = foodJSON.upvotes;

    const downvotebtnArrow = btnDownvote.querySelector('.vote_arrow');
    const downvotebtnCount = btnDownvote.querySelector('.vote_count');
    downvotebtnArrow.setAttribute('data-downvoted', foodJSON.personal.downvote);
    downvotebtnCount.setAttribute('data-downvoted', foodJSON.personal.downvote);
    downvotebtnArrow.innerHTML = foodJSON.personal.downvote ? '&#9660' : '&#9661';
    downvotebtnCount.innerHTML = foodJSON.downvotes;


    const carouselitem = document.querySelector(`.food_carousel_item[data-id=ID_${id}]`);

    carouselitem.querySelector('.food-title').innerHTML = foodJSON.title;
    carouselitem.querySelector('.food-score').innerHTML = foodJSON.votes > 4 ? foodJSON.score : '-';
}

const removeFoodItem = (id) => {
    const fooditem = document.querySelector(`.fooditem[data-id=ID_${id}]`);
    if (fooditem != null) {
        fooditem.remove();
        reloadCarousels();
    }
}

const foodPresenters = document.getElementsByClassName('food_presenter');

const showFoodWindow = (index) => {
    if (foodPresenters[index].classList.contains('active')) {
        foodPresenters[index].classList.remove('active');
    } else {
        for (let i = 0; i < foodPresenters.length; i++) {
            foodPresenters[i].classList.remove('active');
        }
        foodPresenters[index].classList.add('active');
        reloadCarousels();
        setTimeout(() => {
            location.href = `#food_window_${index}`;
        }, 200);
    }
}

const upvote = firebase.app().functions('europe-west1').httpsCallable('upvote');
const downvote = firebase.app().functions('europe-west1').httpsCallable('downvote');
const favorite = firebase.app().functions('europe-west1').httpsCallable('favorite');

fooditems.addEventListener('click', evt => {
    if (evt.target.classList.contains('vote_count') || evt.target.classList.contains('vote_arrow') || evt.target.classList.contains('btn_favorite')) {
        const id = evt.target.getAttribute('data-id');
        switch (evt.target.className.split(" ")[0]) {
            case 'btn_upvote_press':
                const upvoted = evt.target.getAttribute('data-upvoted') == 'true';
                upvote({
                    id,
                    upvoted
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                break;
            case 'btn_downvote_press':
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
