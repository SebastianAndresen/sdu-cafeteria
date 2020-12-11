
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
