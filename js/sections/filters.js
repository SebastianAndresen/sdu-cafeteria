console.log("FILTERS SCRIPT LOADED v1");

const filters = document.querySelector('#filters');

var filterArray = [];

const renderFilterItem = (data, id) => {
    if (!data.visible) return;

    const isUpvoted = data.user_upvotes.includes(user);
    const isDownvoted = data.user_downvotes.includes(user);
    const isFavorite = data.user_favorites.includes(user);
    
    console.log("adding html...");

    const html = `
        <div class="filteritem card-panel white row" data-id="${id}">
            <img src="${data.image}" alt="${data.title} image">
            <div class="filter-title">${data.title}</div>
            <div class="filter-diets">${data.diets}</div>
            <div class="filter-allergies">${data.allergies}</div>
            <div class="filter-price">${data.price}</div>

            <div class="filter-upvotes">Upvotes: ${data.user_upvotes.length}</div>
            <div class="filter-downvotes">Downvotes: ${data.user_downvotes.length}</div>

            <i class="btn_upvote material-icons${isUpvoted ? ' active' : ''}" data-id="${id}" data-upvoted="${isUpvoted}">arrow_circle_up</i>
            <i class="btn_downvote material-icons${isDownvoted ? ' active' : ''}" data-id="${id}" data-downvoted="${isDownvoted}">arrow_circle_down</i>
            <i class="btn_favorite material-icons${isFavorite ? ' active' : ''}" data-id="${id}" data-favorite="${isFavorite}">star_rate</i>
        </div>
    `;

    document.querySelector('#filtered').innerHTML += html;
}

function filterFunction(array){
    var allergies = [];
    var diets = [];
    removeAllFilterItems();
    console.log("filters: ", array);
    db.collection("fooditems").get().then((snapshot)=>{
        snapshot.docs.forEach(doc => {
            console.log("snapshot: ", doc.data());
            console.log(doc.id);
            console.log(doc.data().allergies);
            console.log(doc.data().diets);
            //console.log("Something: ");
            var testBool = false;
            for(var i=0; i < doc.data().allergies; i++ ){
                    console.log("Allergies: ", doc.data().allergies[i]);
                    //testBool = false;
            }
            for( var i = 0; i < filterArray.length; i++){

                if(doc.data().diets.includes(filterArray[i])){
                    testBool = true;
                }
                if(doc.data().allergies.includes(filterArray[i])){
                    console.log("included");
                    testBool = false;
                }                
                console.log(filterArray[i]);
            }
            if(testBool){
                renderFilterItem(doc.data(), doc.id);
            }
            
        });
    });
    
};

function checkboxClicked(filterCat){
    console.log(filterCat);
    var checkbox = document.getElementById(filterCat);
  // Get the output text
    //var text = document.getElementById("text");
    if(checkbox.checked === true ){
        filterArray.push(filterCat);
    }
    else{
        filterArray = filterArray.filter(e => e !== filterCat);
    }

  // If the checkbox is checked, display the output text
    filterFunction(filterArray);
}

const removeAllFilterItems = () => {
    document.querySelector('#filtered').innerHTML = '';
}
/*
filters.addEventListener('click', evt => {
    if(evt.target.tagName=== 'INPUT'){
        const filterName = evt.target.className.split(" ")[0]
        let checkbox = document.querySelector('input[type="checkbox"]:checked');

        if(checkbox != null ){
            filterArray.push(filterName);
        }
        else{
            for( var i = 0; i < filterArray.length; i++){ 
                console.log(filterArray[i]);
                if ( filterArray[i] === filterName) { 
                    console.log("splicing...");
                    filterArray.splice(i, 1); 
                }
            
            }
        }
        console.log("checker: ", filterArray);*/

        //console.log(user);
        //console.log(filterName);
        //const checkbox = document.querySelector('input[type="checkbox"]:checked');
        //console.log("Checkbox: ", checkbox);
        //const check = document.getElementById(filterName);
        //console.log(check);
        //console.log(document.getElementsByClassName("filter-check").checked);
        //console.log("Checkbox is: ", check.checked);
        /*
        switch(filterName){
            case 'vegan':
                break;
            case 'vegetarian':
                break;
            case 'halal':
                break;
            case 'shell-fish':
                break;
            case 'nuts':
                break;
            default:
                break;
        }*/
    /*}
});*/