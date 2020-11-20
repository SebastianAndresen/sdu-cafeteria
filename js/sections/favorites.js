console.log("FAVORITES SCRIPT LOADED v1");

const favorites = document.querySelector('#favorites');

const renderFavorite = (data, id) => {
    if (!data.visible) return;

    const isUpvoted = data.user_upvotes.includes(user);
    const isDownvoted = data.user_downvotes.includes(user);
    const isFavorite = data.user_favorites.includes(user);

    if (isFavorite) {
            console.log("This is a favorite");
            const html = `
            <div class="favoriteItem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="favorite-title">${data.title}</div>
            <div class="favorite-title">${data.price}</div>

            <i class="btn_favorite material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
        </div>
        `;
        favorites.innerHTML += html;
    }
    else{
        console.log("Not a favorite");
    }

    
}

favorites.addEventListener('click', evt => {
    const isFavorite = data.user_favorites.includes(user);
    const favorite = firebase.functions().httpsCallable('favorite');
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        console.log(id);
        console.log(user);
        switch (evt.target.className.split(" ")[0]) {
            case 'btn_upvote':
                upvote(id).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR: ', err.message);
                });
                /*clickUpvote(id,
                    evt.target.getAttribute('data-upvoted') == 'true'
                );*/
                break;
            case 'btn_downvote':
                downvote(id).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR:', err.message);
                });
                /*clickDownvote(id,
                    evt.target.getAttribute('data-downvoted') == 'true'
                );*/
                break;
            case 'btn_favorite':
                favorite(id).catch(err => {
                    //TODO: make nice and shiny error message for user
                    console.log('ERROR:', err.message);
                });
                if(isFavorite){
                    removeFavorite(id);
                }
                else{
                    renderFavorite(change.doc.data(), change.doc.id);
                }

                /*clickFavorite(id,
                    evt.target.getAttribute('data-favorite') == 'true'
                );*/
                break;
            default:
                console.log(`Unknown class: ${evt.target.className.split(" ")[0]}`);
        }
    }
});

const modifyFavorite = (data, id) => {
    if (!data.visible) return;
    console.log("modifyFavorite called");

    const favoriteItem = document.querySelector(`.favoriteItem[data-id=${id}]`);
    // TODO - update image
    favoriteItem.querySelector('.favorite-title').innerHTML = data.title;
    favoriteItem.querySelector('.favorite-price').innerHTML = data.price;

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

const removeRecipe = (id) => {
    const recipe = document.querySelector(`.recipe[data-id=${id}]`);
    recipe.remove();
};