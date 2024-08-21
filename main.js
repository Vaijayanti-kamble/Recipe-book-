const form = document.querySelector('form');
const recipeList = document.querySelector('#recipe-list');
const noRecipe = document.getElementById('no-recipes');
const searchBox = document.getElementById('search-box');
const modal = document.getElementById('recipe-modal');
const modalCloseBtn = modal.querySelector('.close-button');
const modalRecipeName = document.getElementById('modal-recipe-name');
const modalIngredients = document.getElementById('modal-ingredients');
const modalMethod = document.getElementById('modal-method');

let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Ensure recipes are sorted alphabetically on page load
recipes.sort((a, b) => a.name.localeCompare(b.name));

// Display recipes on page load
document.addEventListener('DOMContentLoaded', displayRecipes);

form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleButtonClick);
searchBox.addEventListener('input', event => search(event.target.value));
modalCloseBtn.addEventListener('click', closeModal);

function handleSubmit(event) {
    event.preventDefault();

    const nameInput = document.querySelector('#recipe-name');
    const imageInput = document.querySelector('#recipe-image');
    const ingrInput = document.querySelector('#recipe-ingredients');
    const methodInput = document.querySelector('#recipe-method');

    const name = nameInput.value.trim();
    const ingredients = ingrInput.value.trim().split('\n').map(i => i.trim());
    const methodSteps = methodInput.value.trim().split('\n').map(step => step.trim());
    const imageFile = imageInput.files[0];

    if (name && ingredients.length > 0 && methodSteps.length > 0 && imageFile) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imageData = e.target.result;

            const newRecipe = { name, ingredients, method: methodSteps, image: imageData };
            recipes.push(newRecipe);

            // Sort recipes alphabetically by name after adding a new one
            recipes.sort((a, b) => a.name.localeCompare(b.name));

            nameInput.value = '';
            imageInput.value = '';
            ingrInput.value = '';
            methodInput.value = '';

            saveRecipes();
            displayRecipes();
        };

        reader.readAsDataURL(imageFile);
    }
}


function displayRecipes() {
    recipeList.innerHTML = '';
    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');

        recipeDiv.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name} Image">
            <button class="show-button" data-index="${index}">View Recipe</button>
            <button class="delete-button" data-index="${index}">Delete</button>
        `;

        recipeDiv.classList.add('recipe');
        recipeList.appendChild(recipeDiv);
    });

    if (recipes.length > 0) {
        noRecipe.style.display = 'none';
    } else {
        noRecipe.style.display = 'flex';
    }
}

function handleButtonClick(event) {
    const index = event.target.dataset.index;
    if (event.target.classList.contains('delete-button')) {
        recipes.splice(index, 1);
        saveRecipes();
        displayRecipes();
        searchBox.value = '';
    } else if (event.target.classList.contains('show-button')) {
        openModal(recipes[index]);
    }
}

function search(query) {
    const filteredRecipes = recipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(query.toLowerCase());
    });

    filteredRecipes.sort((a, b) => a.name.localeCompare(b.name)); // Ensure search results are also sorted

    recipeList.innerHTML = '';
    filteredRecipes.forEach((recipe, index) => {
        const recipeEl = document.createElement('div');

        recipeEl.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name} Image">
            <button class="show-button" data-index="${index}">View Recipe</button>
            <button class="delete-button" data-index="${index}">Delete</button>
        `;
        recipeEl.classList.add('recipe');
        recipeList.appendChild(recipeEl);
    });
}

function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function openModal(recipe) {
    modalRecipeName.textContent = recipe.name;
    modalIngredients.innerHTML = recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('');
    modalMethod.innerHTML = recipe.method.map(step => `<li>${step}</li>`).join('');

    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
