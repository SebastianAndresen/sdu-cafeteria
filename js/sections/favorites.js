const favoritesmenu = document.querySelector('#favorites');

const renderFavoriteItem = (data, id) => {
    removeFavoriteItem(id);

    const isFavorite = data.user_favorites.includes(user);
    if (isFavorite) {
        const html = `
            <div class="favoriteitem" data-id="ID_${id}">
                <img src="${data.image}" alt="${data.title} image">
                <div class="favorite-title-container">
                    <div class="favorite-title">${data.title}</div>
                </div>
                <i class="btn_favorite material-icons" data-id="${id}">grade</i>
            </div>
        `;
        favoritesmenu.innerHTML += html;
    }
}

favoritesmenu.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        if (confirm("Remove this Item from Favorites?")) {
            const id = evt.target.getAttribute('data-id');
            favorite({
                id,
                favorited: true
            }).catch(err => {
                console.log('ERROR:', err.message);
            });
        }
    }
});

const modifyFavoriteItem = (data, id) => {
    const isFavorite = data.user_favorites.includes(user);    
    
    removeFavoriteItem(id);
    if (isFavorite){
        renderFavoriteItem(data, id);
    }
}

const removeFavoriteItem = (id) => {
    const favoriteitem = document.querySelector(`.favoriteitem[data-id=ID_${id}]`);
    if(favoriteitem!=null){
        favoriteitem.remove();
    }
}
