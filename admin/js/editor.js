
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
}

const showCreateBtn = () => {

}

const showEditBtn = () => {

}

// buttons
const editorCreateNew = () => {
    clearEditor();
    showCreateBtn();
    openEditor();
};

const editorCreate = () => {
    
    console.log("EDITOR CREATE");
}

const editorSave = () => {
    console.log("EDITOR SAVE");
}

const editorCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
        closeEditor();
    }
}
