
const containsFoodString = [
    'Diary',
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

const foodCategories = [
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

const containsIntArrToStringArr = (int_arr) => {
    let res = [];
    for (let i = 0; i < int_arr.length; i++) {
        res.push(containsFoodString[int_arr[i]]);
    }
    return res;
}

const dataToKeepFromRaw = (data, id) => {
    return {
        id: id,
        contains: data.contains,
        category: data.category,
        daily_reset: data.daily_reset,
        image: data.image,
        lastreset: data.lastreset,
        price: data.price,
        title: data.title,
        visible: data.visible,
        visibledate: data.visibledate
    }
}

const buildTableFromData = (data, id) => {

    let visibilityMessage = "Hidden";
    if (data.visible == 1) visibilityMessage = "Visible";
    if (data.visible == 2) visibilityMessage = `Becomes visible ${setDateFromSeconds(data.visibledate, 'in ', '')}`;

    const visibilityButton = data.visible == 1
        ? `<button type="button" onclick="visibilityHide('${id}')">Hide Now</button>`
        : `<button type="button" onclick="visibilityShow('${id}')">Show Now</button>`;

    return `<table>
                <tr>
                    <td rowspan="4" colspan="3" class="fooditemImage">
                        <img src="${data.image ? data.image : 'https://thumbs.dreamstime.com/b/no-photo-available-missing-image-coming-soon-web-39680127.jpg'}" alt="${data.title} image">
                    </td>
                    <td><p class="desc">Title:</p><h4 class="food-title">${data.title ? data.title : 'missing'}</h4></td>
                    <td rowspan="5"><p class="desc">Alerting Content:</p><p${data.contains.length ? '' : ' class="subinfo"'}>${data.contains.length ? containsIntArrToStringArr(data.contains) : 'nothing'}</p></td>
                    <td>
                        <button type="button" onclick="editfooditem('${id}')">Edit</button>
                        <p class="subinfo">latest edit: ${setDateFromSeconds(data.lastedit, '', ' ago')}</p>
                    </td>
                </tr>
                <tr>
                    <td><p class="desc">Category:</p><p>${data.category != 'undefined' ? foodCategories[data.category] : 'missing'}</p></td>
                    <td></td>
                </tr>
                <tr>
                    <td><p class="desc">Price:</p><p>${data.price ? data.price : 'missing'}</p></td>
                    <td></td>
                </tr>
                <tr>
                    <td><p class="subinfo">${visibilityMessage}</p></td>
                    <td>
                        ${visibilityButton}
                    </td>
                </tr>
                <tr>
                    <td><span>${data.user_upvotes.length}</span> <i class="upscore material-icons">arrow_circle_up</i></td>
                    <td><span>${data.user_downvotes.length}</span> <i class="downscore material-icons">arrow_circle_down</i></td>
                    <td><span>${data.user_favorites.length}</span> <i class="starscore material-icons">star_rate</i></td>
                    <td><p class="subinfo">Score counts since ${setDateFromSeconds(data.lastreset, '', ' ago')}</p></td>
                    <td>
                        <button type="button" onclick="resetscore('${id}')">Reset Score</button>
                    </td>
                </tr>
            </table>`;
}

const foodItemList = document.querySelector('#food_item_list');

const renderFoodItem = (data, id) => {

    const html = `
        <div id="${id}" class="fooditem card-panel white row" data-title="${data.title}" data-cat="${data.category}" data-id="${id}" data-info='${JSON.stringify(dataToKeepFromRaw(data, id))}'>
            ${buildTableFromData(data, id)}
        </div>
    `;

    //foodItemList.innerHTML += html;
    addNewItemAlphabetically(html, data.title.toLowerCase());
}

const addNewItemAlphabetically = (html, title) => {
    const allFoodItems = foodItemList.children;
    for (let i = 0; i < allFoodItems.length; i++) {
        if (title < allFoodItems[i].getAttribute('data-title').toLowerCase()) {
            foodItemList.children[i].insertAdjacentHTML('beforebegin', html);
            return;
        }
    }
    foodItemList.innerHTML += html;
};

const editfooditem = (itemid) => {
    let itemdata = JSON.parse(document.getElementById(itemid).getAttribute('data-info'))
    clearEditor();
    showEditBtn();
    prefillEditor(itemdata);
    openEditor();
};

const adminResetScore = firebase.app().functions('europe-west1').httpsCallable('adminresetscore');
const adminShowItem = firebase.app().functions('europe-west1').httpsCallable('adminshowitem');
const adminHideItem = firebase.app().functions('europe-west1').httpsCallable('adminhideitem');

const visibilityShow = (itemid) => {
    if (confirm("Make item visible in the app?")) {
        adminShowItem({
            id: itemid,
            edittime: getCurrentTime()
        }).catch(err => {
            console.log('ERROR: ', err.message);
        });
    }
};

const visibilityHide = (itemid) => {
    if (confirm("Make item invisible in the app?")) {
        adminHideItem({
            id: itemid,
            edittime: getCurrentTime()
        }).catch(err => {
            console.log('ERROR: ', err.message);
        });
    }
};

const resetscore = (itemid) => {
    if (confirm("Remove all upvotes and downvotes for this item?")) {
        adminResetScore({
            id: itemid,
            edittime: getCurrentTime()
        }).catch(err => {
            console.log('ERROR: ', err.message);
        });
    }
};

const modifyFoodItem = (data, id) => {
    const fooditem = document.querySelector(`.fooditem[data-id=${id}]`);

    fooditem.setAttribute('data-title', data.title);
    fooditem.setAttribute('data-cat', data.category);
    fooditem.setAttribute('data-info', JSON.stringify(dataToKeepFromRaw(data, id)));

    fooditem.innerHTML = buildTableFromData(data, id);
}
