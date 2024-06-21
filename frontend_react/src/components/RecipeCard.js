import React from 'react';

function RecipeCard({ recipe, onRecipeSelect }) {
    const getImageSrc = (recipeName) => {
        const imageName = `${recipeName}.jpg`;
        const imagePath = `${process.env.PUBLIC_URL}/food_pics/${imageName}`;
        const defaultImage = `${process.env.PUBLIC_URL}/food_pics/default.jpg`;

        return imagePathExists(imagePath) ? imagePath : defaultImage;
    };

    const imagePathExists = (url) => {
        const img = new Image();
        img.src = url;
        return img.complete && img.naturalHeight !== 0;
    };

    return (
        <div 
            className="recipe-card" 
            onClick={() => onRecipeSelect(recipe)} 
            style={{ 
                backgroundColor: 'white', 
                padding: '16px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                cursor: 'pointer', 
                marginBottom: '16px' 
            }}
        >
            <img 
                src={getImageSrc(recipe.recipe_name)} 
                alt={recipe.recipe_name} 
                style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '8px', 
                    border: '2px solid #ddd', 
                    objectFit: 'cover',
                    marginBottom: '16px' 
                }} 
            />
            <h3>{recipe.recipe_name}</h3>
        </div>
    );
}

export default RecipeCard;
