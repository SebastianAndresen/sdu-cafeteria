
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
const form_diets_li = form_diets_ul.getElementsByTagName('li');

const form_allergies_ul = document.getElementById('form_allergies');
const form_allergies_li = form_allergies_ul.getElementsByTagName('li');

const datepicker = document.getElementById('form_visibility').getElementsByTagName('input')[0];

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

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
    for (let i = 0; i < form_diets_li.length; i++) {
        form_diets_li[i].className = '';
    }
    for (let i = 0; i < form_allergies_li.length; i++) {
        form_allergies_li[i].className = '';
    }
    datepicker.value = new Date().toDateInputValue();
    titleInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
}

const prefillEditor = (itemdata) => {
    console.log("PREFILLING EDITOR");
    console.log(itemdata);
    console.log("WITH THIS");
};

const showCreateBtn = () => {
    editorCreateBtn.style.display = 'inline';
    editorEditBtn.style.display = 'none';
}

const showEditBtn = () => {
    editorCreateBtn.style.display = 'none';
    editorEditBtn.style.display = 'inline';
}

const buildJSONfromEditor = () => {

}

// buttons
const editorCreateNew = () => {
    clearEditor();
    showCreateBtn();
    openEditor();
};

const editorCreate = () => {
    console.log("CREATE NEW DOCUMENT");
}

const editorSave = () => {
    console.log("UPDATE EXISTING DOCUMENT");
}

const editorCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
        closeEditor();
    }
}
