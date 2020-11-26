
const renderFoodItem = (data, id) => {
    console.log(`Render food item ${id} : ${data}`);

    const html = `
        <div id="${id}" class="fooditem card-panel white row" data-id="${id}">
            <table>
                <tr>
                    <td rowspan="3" colspan="3" class="fooditemImage">
                        <img src="${data.image}" alt="${data.title} image">
                    </td>
                    <td><p class="desc">Title:</p><h3>${data.title}</h3></td>
                    <td><p class="desc">Diets:</p><p>${data.diets}</p></td>
                    <td>
                        <button type="button" onclick="editfooditem('${id}')">Edit</button>
                        <p class="subinfo">${'latest edit'}</p>
                    </td>
                </tr>
                <tr>
                    <td><p class="desc">Price:</p><p>${data.price}</p></td>
                    <td><p class="desc">Allergies</p><p>${data.allergies}</p></td>
                    <td></td>
                </tr>
                <tr>
                    <td colspan="2"><p class="subinfo">Visibility status</p></td>
                    <td>
                        <button type="button" onclick="showhide('${id}')">Show/Hide</button>
                    </td>
                </tr>
                <tr>
                    <td class="fooditemUpvote">${data.user_upvotes.length} <i class="material-icons">arrow_circle_up</i></td>
                    <td class="fooditemDownvote">${data.user_downvotes.length} <i class="material-icons">arrow_circle_down</i></td>
                    <td class="fooditemFavorite">${data.user_favorites.length} <i class="material-icons">star_rate</i></td>
                    <td colspan="2"><p class="subinfo">Score reset status</p></td>
                    <td>
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
