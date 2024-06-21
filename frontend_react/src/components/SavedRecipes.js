import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button, Flex } from '@chakra-ui/react';
import { apiUrl } from './IpAdr';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import { useNavigate } from 'react-router-dom';

const SavedRecipes = ({ userId }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchRecipes = async (url) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setSavedRecipes(data);
        return data;  
      } else {
        throw new Error('Failed to fetch recipes');
      }
    } catch (error) {
      setError('Error fetching recipes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(`${apiUrl}/recipe/${userId}`);
  }, [userId]);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedRecipe(null);
  };

  const handleBack = () => {
    navigate('/recipes');
  };

  return (
    <Box p={4} bg="yellow.100" borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>🔖  Saved Recipes</Heading>
        <Button onClick={handleBack} colorScheme="teal">Back</Button>
      </Flex>
      {isLoading && <Spinner />}
      <div>
        {savedRecipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} onRecipeSelect={handleRecipeSelect} />
        ))}
      </div>
      {selectedRecipe && (
        <RecipeModal
          isOpen={isOpen}
          onClose={onClose}
          recipe={selectedRecipe}
          userId={userId}
          onLogRecipe={(recipe) => console.log('Recipe logged:', recipe)}
        />
      )}
    </Box>
  );
};

export default SavedRecipes;
