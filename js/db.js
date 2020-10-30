// offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            //probably multiple open tabs
            console.log('persistence failed');
        } else if (err.code == 'unimplemented') {
            //lack of browser support
            console.log('persistence is not available');
        }
    });

// real-time listener
db.collection('recipes').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        console.log(change, change.doc.data(), change.doc.id);
        if (change.type === 'added') {
            // add document data to web page
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            // remove document data from web page
            removeRecipe(change.doc.id)
        }
    });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value,
        price: form.price.value,
        path: form.path.value
    };
    db.collection('recipes').add(recipe).catch(err => console.log(err));
    form.title.value = '';
    form.ingredients.value = '';
    form.price.value = '';
    form.path.value = '';
});

// remove recipe
const recipeContainer = document.querySelector('.recipes');
recipes.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        if(evt.target.textContent === 'delete_outline') {
            console.log('delete');
            const id = evt.target.getAttribute('data-id');
            db.collection('recipes').doc(id).delete();
        }
    }
});