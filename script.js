// Assignation des elem Html

const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");

let isError = false;

// Pour etre sur de recevoir un nombre et pas un texte dans mon input
function cleanInputString (str){

// Enlever certains caractères du champ de texte

/*const strArray = str.split('');
const cleanStrArray = [];
for(let i= 0; i < strArray.length ; i++ ){
if (!["+","-"," "].includes(strArray[i]))
cleanStrArray.push(strArray[i]);
};*/

//Refacto du code au dessus

const regex = /[+-\s]/g;
return str.replace(regex,"");
}

// Bloquer les input exponentielles ex : 1e5

function isInvalidInput (str){
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

// 1. Récupérer l'Id des elements du btn dropdown
// 2. Cibler le container corespondant au bon Id

function addEntry(){
/*
const targetId = "#" + entryDropdown.value ;
const targetInputContainer = document.querySelector(`${targetId} .input-container`);
*/

// Refacto code au dessus
const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);

const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length +1;

const HTMLString = `
<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
<input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"></input>
<label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
<input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"></input>
`;

targetInputContainer.insertAdjacentHTML("beforeend",HTMLString);
}

addEntryButton.addEventListener('click',addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);

function getCaloriesFromInputs (list){
    let calories = 0;
    for(const item of list){
       const currVal = cleanInputString(item.value);
       const invalidInputMatch = isInvalidInput(currVal) ;
       if (invalidInputMatch){
        alert(`Invalid input: ${invalidInputMatch[0]}`);
        isError = true;
        return null;
       }
       calories += Number(currVal);
       return calories;
    }
}

function calculateCalories(e) {
    e.preventDefault();
    isError = false;
    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type=number]");
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type=number]");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type=number]");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type=number]");
    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type=number]");

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
    if (isError){
        return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = (budgetCalories - consumedCalories) + exerciseCalories;

    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;

    output.classList.remove("hide");
}

function clearForm(){
    const inputContainers = Array.from(document.querySelectorAll(".input-container"));
    for(const container of inputContainers){
        container.innerHTML="";
    }
    budgetNumberInput.value ="";
    output.innerText = "";
    output.classList.add("hide");
}
