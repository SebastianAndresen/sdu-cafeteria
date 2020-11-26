
const sidebar = document.getElementById('food_sidebar');
const btns = sidebar.getElementsByTagName('p');

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        let current = sidebar.getElementsByClassName('active');
        current[0].className = current[0].className.replace('active', '');
        this.className += ' active';
        console.log(this.getAttribute('data-cat'));
    });
}
