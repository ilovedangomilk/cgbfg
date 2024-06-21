#!/bin/bash

mkdir -p fe/src/{components/{Navbar,InventoryItem,RecipeCard,ShoppingList},pages/{Home,Inventory,Recipes,MealPlan},services,utils}
mkdir -p fe/public

# Create CSS and JSX files for components and pages
declare -a components=("Navbar" "InventoryItem" "RecipeCard" "ShoppingList")
declare -a pages=("Home" "Inventory" "Recipes" "MealPlan")

for component in "${components[@]}"
do
  touch "fe/src/components/$component/$component.jsx"
  touch "fe/src/components/$component/$component.css"
done

for page in "${pages[@]}"
do
  touch "fe/src/pages/$page/$page.jsx"
  touch "fe/src/pages/$page/$page.css"
done

# Create service and utility files
touch fe/src/services/{api,inventoryService,recipeService}.js
touch fe/src/utils/{fetchHelpers,storageHelpers}.js

# Create main app files
touch fe/src/{App.jsx,index.jsx,App.css,index.css}
touch fe/public/index.html

echo "Smart Pantry App structure created."
