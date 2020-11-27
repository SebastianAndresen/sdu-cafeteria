console.log("FAVORITE SCRIPT LOADED v1");

const favorites = document.querySelector('#favorites');

const renderFavoriteItem = (data, id) => {
    if (!data.visible) return;

    //console.log("data: ", data);
    //console.log("id: ", id);

    const isFavorite = data.user_favorites.includes(user);
    if(isFavorite) {
        const html = `
            <div class="favoriteitem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="favorite-title">${data.title}</div>
            <div class="favorite-diets">${data.diets}</div>
            <div class="favorite-allergies">${data.allergies}</div>
            <div class="favorite-price">${data.price}</div>

            <i class="btn_favorite material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
        </div>
        `;
        favorites.innerHTML += html;
    }
}

favorites.addEventListener('click', evt => {
    const favorite = firebase.app().functions('europe-west1').httpsCallable('favorite');
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        //console.log(id);
        //console.log(user);
        switch (evt.target.className.split(" ")[0]) {
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

const modifyFavoriteItem = (data, id) => {
    if (!data.visible) return;
    console.log("modifyFavoriteItemCalled");
    const favoriteitem = document.querySelector(`.favoriteitem[data-id=${id}]`);
    // TODO - update image
    //favoriteitem.querySelector('.favorite-title').innerHTML = data.title;
    const isFavorite = data.user_favorites.includes(user);
    if (isFavorite){
        renderFavoriteItem(data, id);
    }
    else {
        removeFavoriteItem(id);
    }
}

const removeFavoriteItem = (id) => {
    console.log("Removed favorite");
    const favoriteitem = document.querySelector(`.favoriteitem[data-id=${id}]`);
    if(favoriteitem!=null){
        favoriteitem.remove();
    }
}