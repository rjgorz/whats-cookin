//////////////////// IDENTIFIERS /////////////////////////////

const mealContainer = document.querySelector('.meal-container');
const mealsList = document.querySelector('#meals-list');
const background = document.querySelector('#background');
const ingredientButton = document.querySelector('#form-buttons > button:nth-child(1)');
const categoryButton = document.querySelector('#form-buttons > button:nth-child(2)');
const randomButton = document.querySelector('#form-buttons > button:nth-child(3)');
const ingredientForm = document.querySelector('#ingredient-search-form');
const selectForm = document.querySelector('#category');
const categoryForm = document.querySelector('#category-search-form');
const makeSelection = document.querySelector('#make-selection');
const resetButton = document.querySelector('#reset');
const getStarted = document.querySelector('#get-started');
const popup = document.querySelector('#popup');

//////////////////// OPENING POP UP /////////////////////////////

window.addEventListener('load', () => {
    popup.style.display = 'block';
});

//////////////////// CREATING AND PULLING UP MEAL CARDS /////////////////////////////

function renderRandom() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(r => r.json())
    .then(obj => {
        renderMealCard(obj.meals['0']);
    });
}

function renderMealCard(meal) {
    mealContainer.innerHTML = '';
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const closeButton = document.createElement('img');
    const ul = document.createElement('ul');
    const br = document.createElement('br');
    
    img.src = meal.strMealThumb;
    img.id = 'food-img';
    h2.textContent = meal.strMeal;
    
    closeButton.id = 'close';
    closeButton.src = './images/close.png';
    closeButton.addEventListener('click', () => {
        hideMealCard();
    });

    mealContainer.append(closeButton, h2, img, ul, br);

    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`] === '' || meal[`strIngredient${i}`] === null)
            break;

        const li = document.createElement('li');
        li.textContent = `${meal[`strMeasure${i}`]}` + ` ` + `${meal[`strIngredient${i}`]}`
        ul.append(li);
    }

    let instructions = meal.strInstructions.split('\r\n');
    instructions = instructions.map(instruction => instruction.replace('\r\n', ''));
    
    for(let i = 0; i < instructions.length; i++) {
        const p = document.createElement('p');
        p.textContent = instructions[i];
        mealContainer.append(p);
    }

    const p = document.createElement('p');
    p.textContent = '.';
    p.style.opacity = '0';
    mealContainer.append(p);
}

//////////////////// SEARCH RECIPES BY INGREDIENTS /////////////////////////////

function ingredientSelector() {
    ingredientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ingredient = e.target.ingredient.value;
        console.log(ingredient.replace(' ', '_'));
        ingredientForm.reset();
        mealsList.innerHTML = '';

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(r => r.json())
        .then(choiceMeals => renderMealList(choiceMeals.meals));
    });
}

//////////////////// SEARCH RECIPES BY CATEGORIES /////////////////////////////

function fetchSearchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(r => r.json())
    .then(categories => appendSearchCategories(categories.categories));
}

function appendSearchCategories(categories) {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category.strCategory;
        option.value = category.strCategory;
        selectForm.append(option);
    });
}

function categorySelector() {
    categoryForm.addEventListener('change', e => {
        mealsList.innerHTML = '';
        const category = e.target.value;
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(r => r.json())
        .then(r => renderMealList(r.meals));
    });
}

//////////////////// ALL BUTTON LISTENERS /////////////////////////////

function buttonListeners() {
    ingredientButton.addEventListener('click', () => {
        resetPage();
        ingredientForm.style.display = 'inline-block';
        makeSelection.style.display = 'none';
        mealsList.innerHTML = '';
    });
    categoryButton.addEventListener('click', () => {
        resetPage();
        categoryForm.style.display = 'inline-block';
        makeSelection.style.display = 'none';
        mealsList.innerHTML = '';
    });
    randomButton.addEventListener('click', () => {
        resetPage();
        renderRandom();
        mealContainer.classList.add('open-meal-container');
        background.classList.add('background');
        mealsList.innerHTML = '';
    });
    resetButton.addEventListener('click', () => {
        resetPage();
    });
    getStarted.addEventListener('click', () => {
        background.classList.add('open');
        setTimeout(() => {
            popup.style.display = 'none';
            background.style['min-width'] = '1000px';
        }, 3000)
    });
}

//////////////////// CREATE MEAL LIST ICONS /////////////////////////////

function renderMealList(meals) {
    if(meals === null)
        alert('No meals found!');
    else {
        meals.forEach(meal => {
            const img = document.createElement('img');

            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;
            img.title = meal.strMeal;

            img.addEventListener('click', () => {
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(r => r.json())
                .then(obj => {
                    renderMealCard(obj.meals['0']);
                    mealContainer.classList.add('open-meal-container');
                    background.classList.add('background');
                });
            });
            
            mealsList.append(img);
        });
    }
}

//////////////////// RESET FUNCTION /////////////////////////////

function resetPage() {
    ingredientForm.style.display = 'none';
    categoryForm.style.display = 'none';
    makeSelection.style.display = '';
    mealsList.innerHTML = '';
    mealContainer.innerHTML = '';
    mealContainer.classList.remove('open-meal-container');
    background.classList.remove('background');
    categoryForm.reset();
    ingredientForm.reset();
}

//////////////////// PRESS ESC TO CLOSE MENU CARD /////////////////////////////

function hideMealCard(){
    mealContainer.classList.remove('open-meal-container');
    background.classList.remove('background');
    mealContainer.innerHTML = '';
}

window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        if(categoryForm.style.display != 'none' || ingredientForm.style.display != 'none')
            hideMealCard();
        else
            resetPage();
    }
});

//////////////////// CALLING ALL FUNCTIONS /////////////////////////////

buttonListeners();
fetchSearchCategories();
categorySelector();
ingredientSelector();