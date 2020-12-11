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

// ============= MORTEN ========================
// render recipe data to DOM

//Hide filters or notifications if click outside div
document.addEventListener('click', function(evt){
    //console.log(evt.target.className.split(" ")[0]);
    if(!(evt.target.className.split(" ")[0] === 'filters' || evt.target.className.split(" ")[0] === 'notifications' || evt.target.className.split(" ")[0] === 'filter-check'|| evt.target.className.split(" ")[0] === 'notification_setting')){
        var filters = document.getElementById("filters");
        filters.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
        filters.style.visibility = "hidden";
        var notifications = document.getElementById("notifications");
        notifications.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
        notifications.style.visibility = "hidden";
    }
});

//Side navigation
const sidebar = document.querySelector('.sidenav')
sidebar.addEventListener('click', evt => {
    switch(evt.target.className.split(" ")[0]){
        case 'menu':
            hideAll();
            document.getElementById("food_items").style.visibility = "visible";
            break;
        case 'filters':
            hideAll();
            var filters = document.getElementById("filters");
            filters.style.visibility = "visible";
            filters.animate([{marginLeft: '100%'},{marginLeft: '42%'}],{duration: 250});
            document.getElementById("food_items").style.visibility = "visible";
            //document.querySelector("filters").animate({'margin-left':0}, 2000);
            break;
        case 'favorites':
            hideAll();
            document.getElementById("favorites").style.visibility = "visible";
            break;
        case 'notifications':
            hideAll();
            var notifications = document.getElementById("notifications");
            notifications.style.visibility = "visible";
            notifications.animate([{marginLeft: '100%'},{marginLeft: '42%'}],{duration: 250});
            getUserNotifications(auth.currentUser.uid);
            break;
        default:
            break;
    }
});


//Bottom navigation
const bottomNav = document.querySelector('.bot-nav');

bottomNav.addEventListener('click', evt => {
    switch(evt.target.className.split(" ")[0]){
        case 'filters':
            var filters = document.getElementById("filters");
            //If visible => hide when filter is pressed in bottomnav
            if(filters.style.visibility == "visible"){
                filters.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
                filters.style.visibility = "hidden";
            }
            else{
                filters.style.visibility = "visible";
                filters.animate([{marginLeft: '100%'},{marginLeft: '42%'}],{duration: 250});
                var notifications = document.getElementById("notifications");
                notifications.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
                notifications.style.visibility = "hidden";
            }
            break;
        case 'notifications':
            var notifications = document.getElementById("notifications");
            if(notifications.style.visibility === "visible"){
                notifications.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
                notifications.style.visibility = "hidden";
            }else{
                notifications.style.visibility = "visible";
                notifications.animate([{marginLeft: '100%'},{marginLeft: '42%'}],{duration: 250});
                var filters = document.getElementById("filters");
                filters.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
                filters.style.visibility = "hidden";
                getUserNotifications(auth.currentUser.uid);
            }
            break;
        case 'favorites':
            if(document.getElementById("favorites").style.visibility==='visible'){
                hideAll();
                document.getElementById("food_items").style.visibility = "visible";
            }
            else{
            hideAll();
            document.getElementById("favorites").style.visibility = "visible";
            }
            break;
        default:
            break;
    };
});


function hideAll(){
    document.getElementById("favorites").style.visibility = "hidden";
    var filters = document.getElementById("filters");
    filters.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
    filters.style.visibility = "hidden";
    var notifications = document.getElementById("notifications");
    notifications.animate([{marginLeft: '42%'},{marginLeft: '100%'}],{duration: 250});
    notifications.style.visibility = "hidden";
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
        const addToken = firebase.app().functions('europe-west1').httpsCallable('addToken');
        console.log(cb_arr);

        setNotifications(cb_arr);
        messaging.getToken()
            .then(token => {
                console.log('THIS IS YOUR TOKEN: ', token);
                const data = {
                    user: user,
                    token : token,
                    topic : e.target.name
                }
                e.target.checked ? subToTopic(data) : unSubFromTopic(data);
                addToken(token);
            }).catch(err => {
            console.log('error fetching token:', err);
        });
    });
});
