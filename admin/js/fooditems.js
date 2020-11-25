
const renderFoodItem = (data, id) => {
    console.log(`Render food item ${id} : ${data}`);

    const html = `
        <div id="${id}" class="fooditem card-panel white row" data-id="${id}">
            <table>
                <tr>
                    <td rowspan="3" colspan="3" class="fooditemImage">
                        <img src="${data.image}" alt="${data.title} image">
                    </td>
                    <td>${data.title}</td>
                    <td>${data.diets}</td>
                    <td class="floatright">
                        <button type="button" onclick="editfooditem('${id}')">Edit</button>
                    </td>
                </tr>
                <tr>
                    <td>${data.price}</td>
                    <td>${data.allergies}</td>
                    <td class="floatright">latest edit</td>
                </tr>
                <tr>
                    <td colspan="2">Visibility status</td>
                    <td class="floatright">
                        <button type="button" onclick="showhide('${id}')">Show/Hide</button>
                    </td>
                </tr>
                <tr>
                    <td class="fooditemUpvote">${data.user_upvotes.length} <i class="material-icons">arrow_circle_up</i></td>
                    <td class="fooditemDownvote">${data.user_downvotes.length} <i class="material-icons">arrow_circle_down</i></td>
                    <td class="fooditemFavorite">${data.user_favorites.length} <i class="material-icons">star_rate</i></td>
                    <td colspan="2">Score reset status</td>
                    <td class="floatright">
                        <button type="button" onclick="resetscore('${id}')">Reset Score</button>
                    </td>
                </tr>
            </table>
        </div>
    `;

    document.querySelector('#food_item_list').innerHTML += html;
}

const editfooditem = (itemid) => {
    console.log(`edit item ${itemid}`);
};

const showhide = (itemid) => {
    if (confirm("Are you sure?")) {
        console.log(`show hide for ${itemid}`);
    }
};

const resetscore = (itemid) => {
    if (confirm("Are you sure?")) {
        console.log(`reset score for ${itemid}`);
    }
};
