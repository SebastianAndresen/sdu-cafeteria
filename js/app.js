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

const  notifications = document.querySelector('#notifications');
notifications.addEventListener('click', () => {
    setUserNotifications();
});

// ============= MORTEN ========================
// render recipe data to DOM

const sidebar = document.querySelector('.sidenav')
sidebar.addEventListener('click', evt => {
    hideAll();
    console.log(evt.target.className);
    switch(evt.target.className){
        case 'menu sidenav-close':
            document.getElementById("food_items").style.display = "block";
            document.getElementById("add").style.display = "block";
            document.getElementById("logout").style.display = "block";
            break;
        case 'filters sidenav-close':
            document.getElementById("filters").style.display = "block";
            break;
        case 'favorites sidenav-close':
            document.getElementById("favorites").style.display = "block";

            break;
        case 'notifications sidenav-close':
            document.getElementById("notifications").style.display = "block";
            getUserNotifications(auth.currentUser.uid);
            break;
        default:
            break;
    }
});

function hideAll(){
    document.getElementById("favorites").style.display = "none";
    document.getElementById("notifications").style.display = "none";
    document.getElementById("filters").style.display = "none";
    document.getElementById("food_items").style.display = "none";
    document.getElementById("add").style.display = "none";
    document.getElementById("logout").style.display = "none";
};

const getUserNotifications = (id) => {
    let db_notifications;
    const doc = db.collection('users').doc(id);

    // get list of notification settings available on the page and put into an array
    const notification_settings = document.getElementsByClassName('notification_setting');
    let span_array = Array.from(notification_settings, element => element.innerHTML.toLowerCase());

    doc.get().then((doc) => {
        if (doc.exists) {
            db_notifications = doc.data().notifications.map(value => value.toLowerCase());

            //compare values in db notifications and actual notification settings on page
            const compare = span_array.filter(element => db_notifications.includes(element));

            //for each match, check the corresponding checkbox
            for (const val of compare) {
                document.querySelector(`#notification_${val}`).checked = true;
            }
        } else {
            console.log('no data found..');
        }
    });
};

const setUserNotifications = () => {
    let checkedBoxes = document.querySelectorAll('input[class=notification_checkbox]');
    console.log('checked checkboxes: ',checkedBoxes);
};

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
