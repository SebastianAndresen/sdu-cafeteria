//Service Worker registration - do not touch
document.addEventListener('DOMContentLoaded', function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('Service Worker Registered', reg)
            }).catch((err) => {
                console.log('Service Worker not registered', err)
            });
        })
    }
});

//DOM content refs
//const recipes = document.querySelector('.recipes');
const userInfo = document.querySelector('#user_info');
const form = document.querySelector('form');

document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // add recipe form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
});

// add new recipe to DB
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };
    db.collection('recipes').add(recipe).catch(err => console.log(err));
    form.title.value = '';
    form.ingredients.value = '';
});

//test callable http function
const btn = document.querySelector('.call')
btn.addEventListener('click', () => {
    //get function reference
    const testCall = firebase.functions().httpsCallable('testCall');
    testCall().then(result => {
        window.location = result.data;
    });
});



// ============= MORTEN ========================
// render recipe data to DOM

const sidebar = document.querySelector('.sidenav')
sidebar.addEventListener('click', evt => {
    console.log(evt.target.className);
    switch(evt.target.className.split(" ")[0]){
        case 'menu':
            hideAll();
            document.getElementById("food_items").style.visibility = "visible";
            break;
        case 'filters':
            hideAll();
            document.getElementById("filters").style.visibility = "visible";
            break;
        case 'favorites':
            hideAll();
            document.getElementById("favorites").style.visibility = "visible";
            break;
        case 'notifications':
            hideAll();
            document.getElementById("notifications").style.visibility = "visible";
            break;
        default:
            break;
    }
});

function hideAll(){
    document.getElementById("favorites").style.visibility = "hidden";
    document.getElementById("notifications").style.visibility = "hidden";
    document.getElementById("filters").style.visibility = "hidden";
    document.getElementById("food_items").style.visibility = "hidden";
}
// render recipe data to DOM
/*const renderRecipe = (data, id) => {
    const html = `
        <div class="card-panel recipe white row" data-id="${id}">
            <img src="img/dish.png" alt="recipe thumb">
            <div class="recipe-details">
                <div class="recipe-title">${data.title}</div>
                <div class="recipe-ingredients">${data.ingredients}</div>
            </div>
            <div class="recipe-delete">
                    <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
  `;

    recipes.innerHTML += html;
};*/

// remove recipe from DOM function
/*const removeRecipe = (id) => {
    const recipe = document.querySelector(`.recipe[data-id=${id}]`);
    recipe.remove();
};*/

// remove recipe from DB
/*recipes.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
});*/