
let currentCategory = 1;

// admin sidebar
const sidebar = document.getElementById('food_sidebar');
const sidebar_btns = sidebar.getElementsByTagName('p');

for (let i = 0; i < sidebar_btns.length; i++) {
    sidebar_btns[i].addEventListener("click", function () {
        let current = sidebar.getElementsByClassName('active');
        current[0].className = current[0].className.replace('active', '');
        this.className += ' active';
        this.className = this.className.trim();
        currentCategory = this.getAttribute('data-cat');
    });
}

// editor diets
document.querySelector('#form_diets').addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

// editor allergies
document.querySelector('#form_allergies').addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

// editor visibility
const visibilityDiv = document.getElementById('form_visibility');
const visibility_btns = visibilityDiv.getElementsByTagName('p');

for (let i = 0; i < visibility_btns.length; i++) {
    visibility_btns[i].addEventListener("click", function () {
        let current = visibilityDiv.getElementsByClassName('active');
        current[0].className = current[0].className.replace('active', '');
        this.className += ' active';
        this.className = this.className.trim();
    });
}

// editor score
const setscoreDiv = document.getElementById('form_score');
const setscore_btns = setscoreDiv.getElementsByTagName('p');

for (let i = 0; i < setscore_btns.length; i++) {
    setscore_btns[i].addEventListener("click", function () {
        let current = setscoreDiv.getElementsByClassName('active');
        current[0].className = current[0].className.replace('active', '');
        this.className += ' active';
        this.className = this.className.trim();
    });
}

// editor categories
const categoriesDiv = document.getElementById('form_categories');
const categories_btns = categoriesDiv.getElementsByTagName('p');

for (let i = 0; i < categories_btns.length; i++) {
    categories_btns[i].addEventListener("click", function () {
        let current = categoriesDiv.getElementsByClassName('active');
        current[0].className = current[0].className.replace('active', '');
        this.className += ' active';
        this.className = this.className.trim();
    });
}

  /** ************ **/
 /* editor buttons */
/** ************ **/

const editorWrapper = document.getElementById('editor_wrapper');
const editorCreateBtn = document.getElementById('editorBtnCreate');
const editorEditBtn = document.getElementById('editorBtnSave');

const form_diets_ul = document.getElementById('form_diets');
const form_diets_li = Array.from(form_diets_ul.getElementsByTagName('li'));

const form_allergies_ul = document.getElementById('form_allergies');
const form_allergies_li = Array.from(form_allergies_ul.getElementsByTagName('li'));

const datepicker = document.getElementById('form_visibility').getElementsByTagName('input')[0];

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

const concatContainsLiItems = form_allergies_li.concat(form_diets_li);

const titleInput = document.getElementById('form_title');
const priceInput = document.getElementById('form_price');
const imageInput = document.getElementById('form_image');

// setup
const openEditor = () => {
    editorWrapper.className += "active";
}

const closeEditor = () => {
    editorWrapper.className = '';
}

const clearEditor = () => {
    for (let i = 0; i < categories_btns.length; i++) {
        categories_btns[i].className = '';
    }
    categories_btns[Math.max(0, currentCategory - 1)].className = 'active';
    setscore_btns[0].className = 'active';
    setscore_btns[1].className = '';
    for (let i = 0; i < visibility_btns.length; i++) {
        visibility_btns[i].className = '';
    }
    visibility_btns[0].className = 'active';
    for (let i = 0; i < concatContainsLiItems.length; i++) {
        concatContainsLiItems[i].className = '';
    }
    datepicker.value = new Date().toDateInputValue();
    titleInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
}

const prefillEditor = (itemdata) => {
    titleInput.value = itemdata.title;
    priceInput.value = itemdata.price;
    imageInput.value = itemdata.image;
    visibility_btns[0].className = '';
    visibility_btns[itemdata.visible].className = 'active';
    if (itemdata.visible == 2) {
        let presetdate = new Date(0);
        presetdate.setTime(itemdata.visibledate * 1000);
        datepicker.value = presetdate.toDateInputValue();
    }
    for (let i = 0; i < categories_btns.length; i++) {
        categories_btns[i].className = '';
    }
    categories_btns[itemdata.category].className = 'active';
    for (let i = 0; i < itemdata.contains.length; i++) {
        concatContainsLiItems[itemdata.contains[i]].classList.add('checked');
    }
};

const showCreateBtn = () => {
    editorCreateBtn.style.display = 'inline';
    editorEditBtn.style.display = 'none';
}

const showEditBtn = () => {
    editorCreateBtn.style.display = 'none';
    editorEditBtn.style.display = 'inline';
}

const editorAsJSON = () => {
    let today = new Date();
    let visidate = new Date(datepicker.value);

    let catindex = 0;
    for (let i = 0; i < categories_btns.length; i++) {
        if (categories_btns[i].className == 'active') {
            catindex = i;
        }
    }

    let foodContains = [];
    for (let i = 0; i < concatContainsLiItems.length; i++) {
        if (concatContainsLiItems[i].classList.contains('checked')) {
            foodContains.push(i);
        }
    }

    return {
        title: titleInput.value,
        price: priceInput.value,
        image: imageInput.value,
        category: catindex,
        contains: foodContains,
        daily_reset: setscore_btns[1].className == 'active',
        lastedit: Math.floor(today.getTime() / 1000),
        visible: visibility_btns[2].className == 'active' ? 2 : visibility_btns[1].className == 'active' ? 1 : 0,
        visibledate: Math.floor(visidate.getTime() / 1000)
    };
}

// cloud functions
const adminCreateFood = firebase.app().functions('europe-west1').httpsCallable('admincreatenew');

// buttons
const editorCreateNew = () => {
    clearEditor();
    showCreateBtn();
    openEditor();
};

const editorCreate = (itemid) => {
    console.log("CREATE NEW DOCUMENT");
    let editorData = editorAsJSON();
    editorData.lastreset = editorData.lastedit;
    editorData.user_upvotes = [];
    editorData.user_downvotes = [];
    editorData.user_favorites = [];
    adminCreateFood(editorData).catch(err => {
        console.log('ERROR: ', err.message);
    });
    closeEditor();
}

const editorSave = () => {
    console.log("UPDATE EXISTING DOCUMENT");
    console.log(editorAsJSON());
}

const editorCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
        closeEditor();
    }
}
