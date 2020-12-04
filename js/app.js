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
// Show menu

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
            getUserNotifications(auth.currentUser.uid);
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

$(() => {
    $('#notifications').on('click', ':checkbox', e => {
        const cb_arr = [].slice.call(document.querySelectorAll('input:checked')).map(e => e.name);
        const setNotifications = firebase.app().functions('europe-west1').httpsCallable('setNotifications');
        const subToTopic = firebase.app().functions('europe-west1').httpsCallable('subToTopic');
        const unSubFromTopic = firebase.app().functions('europe-west1').httpsCallable('unSubFromTopic');
        setNotifications(cb_arr);
        messaging.getToken()
            .then(token => {
                const data = {
                    token : token,
                    topic : e.target.name
                }
                e.target.checked ? subToTopic(data) : unSubFromTopic(data);
            }).catch(err => {
            console.log('error fetching token:', err);
        });
    });
});
