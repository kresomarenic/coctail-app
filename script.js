'use strict'

import { Coctail } from "./Coctail.js";

const baseApiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';


const searchText = document.getElementById('coctail-input');
const searchBtn = document.getElementById('search-btn');
const coctailList = document.getElementById('found-coctails');    



const handleSearch = (e) => {    

    const searchValue = searchText.value.trim();

    if (searchValue.length === 0) {
        swal('Wrong input', 'Search input should have at least one letter.\nPlease drink a coctail and try again.', 'error');        
    } else {      
        const request = new XMLHttpRequest();
        request.open('GET', `${baseApiUrl}search.php?s=${searchValue}`, true);

        request.onload = (e) => {
            console.log(request);
            if (request.status !== 200) {
                swal('Something went wrong','Ooops. Your search hit the wrong road.\nPlease chill out, drink a coctail, take your time and try again later.', 'error');
            } else {
                const response = JSON.parse(request.response);                
                if (response.drinks === null || response.drinks.length < 1) {
                    swal('Oh, no!', 'No coctails found.\nPlease chill out, think about some other search pattern and try again.', 'info');
                } else {
                    coctailList.innerHTML = '';
                    response.drinks.forEach(coctail => {
                        const foundCoctail = new Coctail(coctail.idDrink, coctail.strDrink);
                        populateSearchResult(foundCoctail);
                    });  
                }                              
            } 
        }
        request.send();
    }       
}



const handleInputKey = (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
}

searchBtn.addEventListener('click', handleSearch);
searchText.addEventListener('keyup', handleInputKey);


const handleDetails = (e) => {
    const request = new XMLHttpRequest();
    request.open('GET', `${baseApiUrl}lookup.php?i=${e.target.id}`, true);

    request.onload = (e) => {
        console.log(request);
            const response = JSON.parse(request.response).drinks[0];
            const coctail = createDetailedCoctailObject(response);
            populateCoctailDetails(coctail);
    }
    request.send();
}

const handleActive = (e) => {
    const activeElement = document.getElementById(e.target.id);
    const parent = activeElement.parentElement;
    parent.childNodes.forEach(child => {
        child.classList.remove('active');
    });    
    activeElement.classList.add('active');
}


function populateSearchResult(foundCoctail) {      

    const newCoctail = document.createElement('li');
    newCoctail.innerText = `${foundCoctail.name}`;
    newCoctail.setAttribute('id', `${foundCoctail.id}`)
    newCoctail.addEventListener('click', handleDetails);
    newCoctail.addEventListener('click', handleActive);

    coctailList.append(newCoctail);
}

function createDetailedCoctailObject(response) {
    const ingredients = [];

    for (const attr in response) {
        if(attr.includes('strIngredient') && response[attr] !== null) {
            ingredients.push(`${response[attr]} - ${response[attr.replace('Ingredient','Measure')]}`);
        }                
    }
    return new Coctail(response.idDrink, response.strDrink, response.strDrinkThumb, response.strInstructions, ingredients);
}

function  populateCoctailDetails(coctail) {    

    const detailsContainer = document.getElementsByClassName('details')[0];
    detailsContainer.innerHTML = '';

    const detailsTitle = document.createElement('h3');
    detailsTitle.innerHTML = coctail.name;
    detailsContainer.append(detailsTitle);

    const detailsPicture = document.createElement('img');
    detailsPicture.src = coctail.picture;
    detailsContainer.append(detailsPicture);   

    const detailsIngedientsTitle = document.createElement('h4');
    detailsIngedientsTitle.innerText = 'Ingredients';
    detailsContainer.append(detailsIngedientsTitle);

    const detailsIngredients = document.createElement('ul');
    coctail.ingredients.forEach(ingredient => {
        console.log(ingredient);
        const ingredientEl = document.createElement('li');
        ingredientEl.innerText = ingredient;
        detailsIngredients.append(ingredientEl);
    });
    detailsContainer.append(detailsIngredients);

    const detailsInstructions = document.createElement('div');
    detailsInstructions.innerHTML = `<h4>Instructions:</h4> ${coctail.instructions}`;
    detailsContainer.append(detailsInstructions);
}


