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
    const isFavorite = false;

    const html = `
        <div class="fooditem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="food-title">${data.title}</div>
            <div class="food-diets">${data.diets}</div>
            <div class="food-allergies">${data.allergies}</div>
            <div class="food-price">${data.price}</div>

            <div class="food-upvotes">Upvotes: ${data.user_upvotes.length}</div>
            <div class="food-downvotes">Downvotes: ${data.user_downvotes.length}</div>

            <i class="btn_upvote material-icons" data-id="${id}" data-upvoted="${isUpvoted}" style="color: ${isUpvoted ? 'green' : 'gray'}">arrow_circle_up</i>
            <i class="btn_downvote material-icons" data-id="${id}" data-downvoted="${isDownvoted}" style="color: ${isDownvoted ? 'red' : 'gray'}">arrow_circle_down</i>
            <i class="btn_favorite material-icons" data-id="${id}" data-favorite="${isFavorite}" style="color: ${isFavorite ? 'yellow' : 'gray'}">star_rate</i>
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

const modifyFoodItem = () => {
    console.log("MODIFY FOOD ITEM");
}

const removeFoodItem = () => {
    console.log("REMOVE FOOD ITEM");
}
