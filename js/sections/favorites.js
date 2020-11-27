console.log("FAVORITES SCRIPT LOADED v1");

const favorites = document.querySelector('#favorites');

const renderFavorite = (data, id) => {
    if (!data.visible) return;

    const isFavorite = data.user_favorites.includes(user);

    if (isFavorite) {
            const html = `
            <div class="favoriteItem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="favorite-title">${data.title}</div>

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
        console.log(id);
        console.log(user);

                const favorited = evt.target.getAttribute('data-favorite') == 'true';
                favorite({
                    id,
                    favorited
                }).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR:', err.message);
                });
    }
});

const modifyFavorite = (data, id) => {
    if (!data.visible) return;
    console.log("modifyFavorite called");

    const favoriteItem = document.querySelector(`.favoriteItem[data-id=${id}]`);

    console.log(favoriteItem);
    // TODO - update image
    const isFavorite = data.user_favorites.includes(user);

    const btnFavorite = favoriteItem.querySelector('.btn_favorite');

    //fooditem.querySelector('.btn_upvote').setAttribute('data-upvoted', isUpvoted).classList.remove("active").classList.add(isUpvoted ? 'active':'');

    btnFavorite.setAttribute('data-favorite', isFavorite);

    btnFavorite.classList.remove("active");

    if (isFavorite) btnFavorite.classList.add("active");
}

const removeFavorite = (id) => {
    const favoriteItem = document.querySelector(`.favoriteItem[data-id=${id}]`);
    favoriteItem.remove();
};