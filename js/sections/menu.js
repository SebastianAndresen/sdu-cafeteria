console.log("MENU SCRIPT LOADED v11");

const foodcategoriesDOM = [
    document.querySelector('#food_category_news'),
    document.querySelector('#food_category_daily'),
    document.querySelector('#food_category_drinks')
];

const renderFoodItem = (data, id) => {
    console.log("RENDER FOOD ITEM");
    console.log(data);
    const html = `
        <div class="card-panel recipe white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="recipe-details">
                <div class="food-title">${data.title}</div>
                <div class="food-">${data.ingredients}</div>
            </div>
            <div class="recipe-delete">
                    <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
    `;

    if (data.category < foodcategoriesDOM.length);
    foodcategoriesDOM[data.category].innerHTML += html;
}

const removeFoodItem = () => {
    console.log("REMOVE FOOD ITEM");
}
