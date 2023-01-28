'use strict'

const searchText = document.getElementById('coctail-input');
const searchBtn = document.getElementById('search-btn');
const coctailList = document.getElementById('found-coctails');    

class Coctail {
        
    constructor(id, name, picture, instructions, ingredients) {
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.instructions = instructions;
        this.ingredients = ingredients;
    }
}

const handleSearch = (e) => {
    console.log('Clicked search');

    const searchValue = searchText.value.trim();

    if (searchValue.length === 0) {
        swal('Wrong input', 'Search input should have at least one letter.\nPlease drink a coctail and try again.', 'error');
        //alert("Search input should have at least one letter.\nPlease drink a coctail and try again.");
    } else {
        const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`;
        const request = new XMLHttpRequest();
        request.open('GET', apiUrl, true);

        request.onload = (e) => {
            console.log(request);
            if (request.status !== 200) {
                swal('Something went wrong','Ooops. Your search hit the wrong road.\nPlease chill out, drink a coctail, take your time and try again later.', 'error');
                //alert("Ooops. Your search hit the wrong road.\nPlease chill out, drink a coctail, take your time and try again later.");
            } else {
                const response = JSON.parse(request.response);
                console.log(response);
                console.log(response.drinks);
                if (response.drinks === null || response.drinks.length < 1) {
                    swal('Oh, no!', 'No coctails found.\nPlease chill out, think about some other search pattern and try again.', 'info');
                    //alert('Oh, no!\nNo coctails found.\nPlease chill out, think and try again');
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
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${e.target.id}`;
        const request = new XMLHttpRequest();
        request.open('GET', apiUrl, true);

        request.onload = (e) => {
            console.log(request);
            const response = JSON.parse(request.response).drinks[0];
            console.log(response);
            
            const ingredients = [];

            for (const attr in response) {
                if(attr.includes('strIngredient') && response[attr] !== null) {
                    ingredients.push(response[attr]);
                }                
            }

            const coctail = new Coctail(response.idDrink, response.strDrink, response.strDrinkThumb, response.strInstructions, ingredients);
            console.log(coctail);
            populateCoctailDetails(coctail);

            

            
            

        }

        request.send();
}


function populateSearchResult(foundCoctail) {      

    const newCoctail = document.createElement('li');
    newCoctail.innerText = `${foundCoctail.name}`;
    newCoctail.setAttribute('id', `${foundCoctail.id}`)
    newCoctail.addEventListener('click', handleDetails);

    coctailList.append(newCoctail);
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

    const detailsInstructions = document.createElement('div');
    detailsInstructions.innerHTML = `<h4>Instructions:</h4> ${coctail.instructions}`;
    detailsContainer.append(detailsInstructions);

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

    
    


    
    


};


