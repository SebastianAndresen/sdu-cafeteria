
let currentCategory = 10;

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
        filterFoodItems();
    });
}

const noContentInCategory = document.getElementById('noContentInCategory');

const filterFoodItems = () => {
    const allFoodItems = foodItemList.children;
    let itemsVisible = 0;
    for (let i = 0; i < allFoodItems.length; i++) {
        if (allFoodItems[i].getAttribute('data-cat') == currentCategory || currentCategory == 10) {
            allFoodItems[i].classList.remove('filteredAway');
            itemsVisible++;
        } else {
            allFoodItems[i].classList.add('filteredAway');
        }
    }
    if (itemsVisible) {
        noContentInCategory.classList.remove('show');
    } else {
        noContentInCategory.classList.add('show');
    }
}

const getCurrentTime = () => {
    const today = new Date();
    return Math.floor(today.getTime() / 1000);
}

const setDateFromSeconds = (sec, prefix, suffix) => {
    let now = new Date();
    let d = new Date(0);
    d.setTime(sec * 1000);
    let diff = Math.abs((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${prefix}${Math.floor(diff)} second${Math.floor(diff) == 1 ? '' : 's'}${suffix}`;
    diff /= 60;
    if (diff < 60) return `${prefix}${Math.floor(diff)} minute${Math.floor(diff) == 1 ? '' : 's'}${suffix}`;
    diff /= 60;
    if (diff < 24) return `${prefix}${Math.floor(diff)} hour${Math.floor(diff) == 1 ? '' : 's'}${suffix}`;
    diff /= 24;
    if (diff < 14) return `${prefix}${Math.floor(diff)} day${Math.floor(diff) == 1 ? '' : 's'}${suffix}`;
    return d.toLocaleDateString('da-DK');
}

const setItemToLoading = (id) => {
    const fooditem = document.querySelector(`.fooditem[data-id=${id}]`);
    fooditem.classList.add('loading');
}
