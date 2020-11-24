
const renderFoodItem = (data, id) => {
    console.log(`Render food item ${id} : ${data}`);

    const html = `
        <div class="fooditem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="food-title">${data.title}</div>
            <div class="food-diets">${data.diets}</div>
            <div class="food-allergies">${data.allergies}</div>
            <div class="food-price">${data.price}</div>

            <div class="food-upvotes">Upvotes: ${data.user_upvotes.length}</div>
            <div class="food-downvotes">Downvotes: ${data.user_downvotes.length}</div>

            <i class="material-icons">arrow_circle_up</i>
            <i class="material-icons">arrow_circle_down</i>
            <i class="material-icons">star_rate</i>
        </div>
    `;

    document.querySelector('#food_item_list').innerHTML += html;
}
