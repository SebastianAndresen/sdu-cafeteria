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
        <div class="fooditem" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
           <div>
            <div class="food-title card-data">${data.title}</div>
            <div class="food-diets card-data">${data.diets}</div>
            <div class="food-allergies card-data">${data.allergies}</div>
            <div class="food-price card-data">${data.price}</div>
           
            <div class="food-upvotes card-data">Upvotes: ${data.user_upvotes.length}</div>
            <div class="food-downvotes card-data">Downvotes: ${data.user_downvotes.length}</div>

            <i class="btn_upvote material-icons${isUpvoted ? ' active' : ''}" data-id="${id}" data-upvoted="${isUpvoted}">arrow_circle_up</i>
            <i class="btn_downvote material-icons${isDownvoted ? ' active' : ''}" data-id="${id}" data-downvoted="${isDownvoted}">arrow_circle_down</i>
            <i class="btn_favorite material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
           </div>
        </div>
    `;

    if (data.category < foodcategoriesDOM.length) ;
    foodcategoriesDOM[data.category].innerHTML += html;
}

fooditems.addEventListener('click', evt => {
    const upvote = firebase.app().functions('europe-west1').httpsCallable('upvote');
    const downvote = firebase.app().functions('europe-west1').httpsCallable('downvote');
    const favorite = firebase.app().functions('europe-west1').httpsCallable('favorite');
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        console.log(id);
        console.log(user);
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
                /*clickUpvote(id,
                    evt.target.getAttribute('data-upvoted') == 'true'
                );*/
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
                /*clickDownvote(id,
                    evt.target.getAttribute('data-downvoted') == 'true'
                );*/
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
                /*clickFavorite(id,
                    evt.target.getAttribute('data-favorite') == 'true'
                );*/
                break;
            default:
                console.log(`Unknown class: ${evt.target.className.split(" ")[0]}`);
        }
    }
});

const modifyFoodItem = (data, id) => {
    if (!data.visible) return;
    console.log("modifyFoodItemCalled");

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
    /*
    if (isFavorite) {
        btnFavorite.classList.add("active");
    }
    else{
        removeFavorite(id);
    }*/
}

const removeFoodItem = () => {
    console.log("REMOVE FOOD ITEM");
}

const renderUser = (data, id) => {
    console.log(`User found! rendering ${id}`);
    let html =
        `<h5>${id}</h5>
         <p>${JSON.stringify(data, null, 20)}</p>`;
    userInfo.innerHTML = html;
};

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


