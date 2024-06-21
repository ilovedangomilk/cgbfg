import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useToast,
  IconButton,
  Flex,
  Divider,
  Box
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { apiUrl } from './IpAdr';
import Heart from '@react-sandbox/heart';

function RecipeModal({ isOpen, onClose, recipe, userId }) {
    const toast = useToast();
    const [active, setActive] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const checkRecipeInDatabase = async () => {
            try {
                const response = await fetch(`${apiUrl}/recipe/${String(userId)}`);
                const data = await response.json();
                if (data.some(r => r.recipe_name === recipe.recipe_name)) {
                    setActive(true);
                } else {
                    setActive(false);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to check recipe in database.",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        };

        if (isOpen) {
            checkRecipeInDatabase();
        }
    }, [isOpen, recipe.recipe_name, userId, toast]);

    const parseIngredients = (ingredientsStr) => {
        return ingredientsStr.slice(1, -1).split("), (").map(item =>
            item.replace(/[()']/g, '').split(", ")
        ).map(item => ({
            name: item[0],
            quantity: item[1]
        }));
    };

    const parseInstructions = (instructionsStr) => {
        return instructionsStr.slice(2, -2).split("', '").map(instruction =>
            instruction.trim().replace(/^'/, "").replace(/'$/, "")
        );
    };

    const getImageSrc = (recipeName) => {
        const imageName = `${recipeName}.jpg`;
        const imagePath = `${process.env.PUBLIC_URL}/food_pics/${imageName}`;
        return imagePath;
    };

    const handleEditIngredients = async (recipe) => {
        const ingredients = parseIngredients(recipe.ingredients);
    
        // Prepare the data to be sent in the request
        const data = ingredients.map(ingredient => ({
            user_id: recipe.user_id,
            item: ingredient.name,
            quantity: ingredient.quantity,
            category: '',
            purchase_date: '',
            expiry_date: ''
        }));
    
        try {
            const response = await fetch(`${apiUrl}/update_inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update inventory');
            }

            toast({
                title: "Inventory Updated",
                description: "Ingredients have been successfully updated in the inventory.",
                status: "success",
                duration: 5000,
                isClosable: true
            });
        } catch (error) {
            // Utilize a toast to display error messages
            toast({
                title: "Error Updating Inventory",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };

    const handleHeartClick = async () => {
        try {
            if (active) {
                // Delete the recipe from the database
                const response = await fetch(`${apiUrl}/delete_recipe`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        recipe_name: recipe.recipe_name
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to delete recipe');
                }

                toast({
                    title: "Recipe Deleted",
                    description: "Recipe has been successfully deleted from your saved recipes.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
                setActive(false);
            } else {
                // Add the recipe to the database
                const response = await fetch(`${apiUrl}/add_recipe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([{
                        user_id: userId,
                        recipe_name: recipe.recipe_name,
                        ingredients: parseIngredients(recipe.ingredients).map(ingredient => [ingredient.name, ingredient.quantity]),
                        instructions: parseInstructions(recipe.instructions),
                        difficulty: recipe.difficulty,
                        time_required: recipe.time_required,
                        description: recipe.description
                    }]),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to add recipe');
                }

                toast({
                    title: "Recipe Added",
                    description: "Recipe has been successfully added to your saved recipes.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
                setActive(true);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent p={5}>
                <Flex justifyContent="space-between" alignItems="center" p={3} bg="#FFF5BA" borderRadius="8px 8px 0 0" >
                    <IconButton 
                        icon={<ChevronLeftIcon boxSize={6} />} 
                        paddingTop="15px"
                        aria-label="Back" 
                        onClick={onClose} 
                        variant="ghost"
                    />
                    <Box
                        flex="1"
                        height="60px"
                        textAlign="center"
                        paddingTop="6px"
                        fontSize="xl"
                        fontWeight="bold"
                        margin="0px 16px" 
                        marginBottom="-10"
                        bg="#FFFFFF"
                        borderRadius="8px 8px 0 0"
                    >
                        {recipe.recipe_name}
                    </Box>
                    <Heart
                        width={25}
                        height={25}
                        active={active}
                        onClick={handleHeartClick}
                        style={{ marginRight: '16px', marginTop: '12px'}}
                    />
                </Flex>
                <ModalBody>
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
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/food_pics/default.jpg`}
                    />
                    <Button
                        onClick={() => setShowIngredients(!showIngredients)}
                        variant="ghost"
                        width="100%"
                        textAlign="left"
                        justifyContent="space-between"
                        display="flex"
                        rightIcon={showIngredients ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        sx={{ fontSize: "md", fontWeight: 'bold' }}
                    >
                        Ingredients
                    </Button>
                    {showIngredients && (
                        <ul style={{ fontSize: 'sm' }}>
                            {parseIngredients(recipe.ingredients).map((ingredient, index) => (
                                <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                            ))}
                        </ul>
                    )}
                    <Divider my={4} />
                    <Button
                        onClick={() => setShowInstructions(!showInstructions)}
                        variant="ghost"
                        width="100%"
                        textAlign="left"
                        justifyContent="space-between"
                        display="flex"
                        rightIcon={showInstructions ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        sx={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Instructions
                    </Button>
                    {showInstructions && (
                        <ol style={{ fontSize: 'sm' }}>
                            {parseInstructions(recipe.instructions).map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => handleEditIngredients(recipe)}>
                        I Cooked This!
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RecipeModal;
