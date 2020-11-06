console.log("MENU SCRIPT LOADED v18");

const fooditems = document.querySelector('#food_items');

const foodcategoriesDOM = [
    document.querySelector('#food_category_news'),
    document.querySelector('#food_category_daily'),
    document.querySelector('#food_category_drinks')
];

const renderFoodItem = (data, id) => {
    if (!data.visible) return;

    const isUpvoted = data.user_upvotes.includes(user);
    const isDownvoted = data.user_downvotes.includes(user);
    const isFavorite = data.user_favorites.includes(user);

    const html = `
        <div class="fooditem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="food-title">${data.title}</div>
            <div class="food-diets">${data.diets}</div>
            <div class="food-allergies">${data.allergies}</div>
            <div class="food-price">${data.price}</div>

            <div class="food-upvotes">Upvotes: ${data.user_upvotes.length}</div>
            <div class="food-downvotes">Downvotes: ${data.user_downvotes.length}</div>

            <i class="btn_upvote material-icons${isUpvoted ? ' active':''}" data-id="${id}" data-upvoted="${isUpvoted}">arrow_circle_up</i>
            <i class="btn_downvote material-icons${isDownvoted ? ' active':''}" data-id="${id}" data-downvoted="${isDownvoted}">arrow_circle_down</i>
            <i class="btn_favorite material-icons${isFavorite ? ' active':''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
        </div>
    `;

    if (data.category < foodcategoriesDOM.length);
    foodcategoriesDOM[data.category].innerHTML += html;
}

fooditems.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        switch (evt.target.className.split(" ")[0]) {
            case 'btn_upvote':
                clickUpvote(id,
                    evt.target.getAttribute('data-upvoted') == 'true'
                    );
                break;
            case 'btn_downvote':
                clickDownvote(id,
                    evt.target.getAttribute('data-downvoted') == 'true'
                    );
                break;
            case 'btn_favorite':
                clickFavorite(id,
                    evt.target.getAttribute('data-favorite') == 'true'
                    );
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
    fooditem.querySelector('.food-diets').innerHTML = data.diets;
    fooditem.querySelector('.food-allergies').innerHTML = data.allergies;
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
}

const removeFoodItem = () => {
    console.log("REMOVE FOOD ITEM");
}

const renderUser = (data, id) => {
    let html =
    `<h5>${id}</h5>
         <p>${JSON.stringify(data, null, 20)}</p>`;
    userInfo.innerHTML = html;
};
