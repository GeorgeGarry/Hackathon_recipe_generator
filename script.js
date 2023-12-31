// const { json } = require("stream/consumers");

const form = document.getElementById("form");
const cuisine_select = document.getElementById("cuisine_select");
const food_query = document.getElementById("food_query");
const meal_type = document.getElementById("meal_type");
const likes = document.getElementById("likes");
const dislikes = document.getElementById("dislikes");
const dish_title = document.getElementById("dish_title");
const time_cooking = document.getElementById("time_cooking");
const results_on_page = document.getElementById("results_on_page");

// minCarbs: '10',
// maxCarbs: '100',
// minProtein: '10',
// maxProtein: '100',
// minCalories: '50',
// maxCalories: '800',
// minFat: '10',
// maxFat: '100',
// minAlcohol: '0',
// maxAlcohol: '100',
// minCaffeine: '0',
// maxCaffeine: '100',
// minCopper: '0',
// maxCopper: '100',
// minCalcium: '0',
// maxCalcium: '100',
// minCholine: '0',
// maxCholine: '100',
// minCholesterol: '0',
// maxCholesterol: '100',
// minFluoride: '0',
// maxFluoride: '100',
// minSaturatedFat: '0',
// maxSaturatedFat: '100',
// minVitaminA: '0',
// maxVitaminA: '100',
// minVitaminC: '0',
// maxVitaminC: '100',
// minVitaminD: '0',
// maxVitaminD: '100',
// minVitaminE: '0',
// maxVitaminE: '100',
// minVitaminK: '0',
// maxVitaminK: '100',
// minVitaminB1: '0',
// maxVitaminB1: '100',
// minVitaminB2: '0',
// maxVitaminB2: '100',
// minVitaminB5: '0',
// maxVitaminB5: '100',
// minVitaminB3: '0',
// maxVitaminB3: '100',
// minVitaminB6: '0',
// maxVitaminB6: '100',
// minVitaminB12: '0',
// maxVitaminB12: '100',
// minFiber: '0',
// maxFiber: '100',
// minFolate: '0',
// maxFolate: '100',
// minFolicAcid: '0',
// maxFolicAcid: '100',
// minIodine: '0',
// maxIodine: '100',
// minIron: '0',
// maxIron: '100',
// minMagnesium: '0',
// maxMagnesium: '100',
// minManganese: '0',
// maxManganese: '100',
// minPhosphorus: '0',
// maxPhosphorus: '100',
// minPotassium: '0',
// maxPotassium: '100',
// minSelenium: '0',
// maxSelenium: '100',
// minSodium: '0',
// maxSodium: '100',
// minSugar: '0',
// maxSugar: '100',
// minZinc: '0',
// maxZinc: '100',

form.addEventListener("submit", send_request);

// function
function get_recipe_steps_ingredients_equipment_list(obj) {
  const ol_steps = document.createElement("ol");
  ol_steps.classList.add("result-ol-list");
  const p_instructions = document.createElement("p");
  p_instructions.innerText = "Instructions:";
  ol_steps.append(p_instructions);
  const ul_ingridients = document.createElement("ul");
  const p_ingridients = document.createElement("p");
  p_ingridients.innerText = "Ingredients:";
  ul_ingridients.append(p_ingridients);
  ul_ingridients.classList.add("result-ul-list");
  let ul_equipment = document.createElement("ul"); //sometimes there are no equpment in the recipe
  const p_equipment = document.createElement("p");
  p_equipment.innerText = "You will need:";
  ul_equipment.append(p_equipment);
  ul_equipment.classList.add("result-ul-list");
  const steps_obj = obj.analyzedInstructions[0].steps;

  let ingredients_arr = [];
  let equipment_arr = [];

  for (step of steps_obj) {
    for (eqp of step.equipment) {
      if (!equipment_arr.includes(eqp.name)) {
        equipment_arr.push(eqp.name);
      }
    }
    for (ing of step.ingredients) {
      if (!ingredients_arr.includes(ing.name)) {
        ingredients_arr.push(ing.name);
      }
    }
    const li = document.createElement("li");
    li.classList.add("step");
      li.innerText = step.step;
    ol_steps.appendChild(li);
  }
  for (ing of ingredients_arr) {
    const li = document.createElement("li");
    li.classList.add("ingredient");
    li.innerText = ing;
    ul_ingridients.appendChild(li);
  }

  const li = document.createElement("li");
  li.classList.add("step");
  li.innerText = step.step;
  ol_steps.appendChild(li);

  // console.log(equipment_arr.length);
  if (equipment_arr.length > 0){
    for (eqp of equipment_arr) {
      const li = document.createElement("li");
      li.classList.add("equipment");
      li.innerText = eqp;
      ul_equipment.appendChild(li);}
    }
  else{
    ul_equipment=null;
  }

  return {
    steps: ol_steps,
    ingredients: ul_ingridients,
    equipment: ul_equipment,
  };
}

function display_results(res_array) {
  const container_div = document.getElementById("res_container");
  container_div.innerHTML = "";
  for (i of res_array) {
    const {steps,ingredients,equipment} = get_recipe_steps_ingredients_equipment_list(i);
    const div_card = document.createElement("div");
    div_card.classList.add("result-card");
    const dish_img = document.createElement("img");
    dish_img.classList.add("result-img");
    dish_img.src = i.image;
    const title_h3 = document.createElement("h3");
    title_h3.classList.add("result-title");
    title_h3.innerText = i.title;
    const calories_p = document.createElement("p");
    calories_p.classList.add("result-para");
    calories_p.innerText = `${i.nutrition.nutrients[0].amount} kcal/100g`;
    const recipe_steps_ul = steps;
    const ingredients_ul = ingredients;
    

    div_card.appendChild(dish_img);
    div_card.appendChild(title_h3);
    div_card.appendChild(calories_p);
    div_card.appendChild(recipe_steps_ul);
    div_card.appendChild(ingredients_ul);
    if (equipment != null){
      const equipment_ul = equipment;
      div_card.appendChild(equipment_ul);
    }
    

    container_div.appendChild(div_card);
  }
}

function get_random_ids(res_length) {
  const random_numbers = new Set();
  const number_of_results = parseInt(results_on_page.value);

  while (random_numbers.size < number_of_results) {
    const random_num = Math.floor(Math.random() * res_length);
    random_numbers.add(random_num);
  }

  return Array.from(random_numbers);
}

async function send_request(e) {
  e.preventDefault();
  let display_ids;
  const cuisine = cuisine_select.value;
  const query = food_query.value;
  const type = meal_type.value;
  const includeIngredients = likes.value;
  const excludeIngredients = dislikes.value;
  const titleMatch = dish_title.value;
  const maxReadyTime = time_cooking.value;

  const options = {
    method: "GET",
    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
    params: {
      query,
      cuisine,
      diet: "",
      equipment: "",
      includeIngredients,
      excludeIngredients,
      type,
      instructionsRequired: "true",
      fillIngredients: "true",
      addRecipeInformation: "true",
      titleMatch,
      maxReadyTime,
      ignorePantry: "true",
      sort: "calories",
      sortDirection: "asc",
      offset: "0",
      number: "100",
      limitLicense: "false",
      ranking: "2",
    },
    headers: {
      "X-RapidAPI-Key": "27ffa4af19mshebbc84d4c789642p1dbda0jsnfd8637064c9c",
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };
  
  try {
    const response = await axios.request(options);
    if (response.data.results.length >= 5) {
      display_ids = get_random_ids(response.data.results.length);
    } else {
      display_ids = response.data.results.map((item, index) => index);
    }
    const display_objects_select = display_ids.map(
      (id) => response.data.results[id]
    );
    display_results(display_objects_select);
  } catch (error) {
    console.error(error);
  }
}
