const recipes = document.querySelector('.recipes');

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'left'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});

});


// render recipe data
const renderRecipe = (data, id) => {
  const html = `
        <div class="card-panel recipe white row" data-id="${id}">
        <div class="top">
            <img src="${data.path}" alt="recipe thumb">
            <div class="recipe-details">
                <div class="recipe-title">${data.title}</div>
                <div class="recipe-ingredients">${data.ingredients}</div>
            </div>
            <div class="recipe-price">${data.ingredients},-</div>
        </div>
        <div class="bottom">
            <div class="recipe-up">
                <i class="material-icons">thumb_up</i>
            </div>
            <div class="recipe-down">
                <i class="material-icons">thumb_down</i>
            </div>
            <div class="recipe-favourite">
                <i class="material-icons">star</i>
            </div>
            <div class="recipe-delete">
                <i class="material-icons" data_id="${id}">delete_outline</i>
            </div>
        </div>
    </div>
  `;

  recipes.innerHTML += html;
};

// remove recipe function
const removeRecipe = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
};

function switchColors(element)  
{  
        links=document.getElementsByTagName("li") ;  
        for (var i = 0 ; i < links.length ; i ++)  
        links.item(i).style.color = 'black' ;  
        element.style.color='orange' ;  
}  