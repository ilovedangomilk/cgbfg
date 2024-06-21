import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  IconButton,
  Switch,
  Flex,
  useToast,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FaRegBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "./IpAdr";
import IngredientItem from "./IngredientItem";
import RecipeModal from "./RecipeModal"; // Import RecipeModal
import "./RecipeList.css";

const RecipeList = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [servings, setServings] = useState(1);
  const [preferences, setPreferences] = useState("");
  const [inventory, setInventory] = useState([]);
  const [showExpiring, setShowExpiring] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State to hold the selected recipe
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const toast = useToast();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchRecommendedRecipes = useCallback(
    async (
      url = `${apiUrl}/recommend_recipe/${userId}?cuisine=${preferences}&servings=${servings}`
    ) => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
        setSelectedRecipe(data[0]); // Set the first recipe as the selected recipe
        setIsModalOpen(true); // Open the modal
      } catch (error) {
        setError(`Error fetching recipes: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, preferences, servings]
  );

  const fetchInventoryItems = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/grocery/${userId}`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to fetch inventory");
      }
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      toast({
        title: "Error fetching inventory",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchInventoryItems();
  }, [userId, fetchInventoryItems]);

  const filteredInventory = useMemo(() => {
    return showExpiring
      ? inventory.filter(
          (item) => calculateDaysUntilExpiry(item.expiry_date) <= 5
        )
      : inventory;
  }, [inventory, showExpiring]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-content">
      <Box>
      <Box alignItems="center" justifyContent="center" display="flex">      <Heading mb={4}>Recipe Generator</Heading>      </Box>
      <Box alignItems="center" justifyContent="center" display="flex">
      <Text mb={4} width="95%">
        Time to create some magic in the kitchen! Select the ingredients you
        would like to cook with.
      </Text>
      </Box>

      <Box justifyContent="center" alignItems="center" display="flex">
        <Box bg="#19956D" p={4} borderRadius="md" boxShadow="md" width="95%">
          <Flex align="center" mb={4}>
            <FormLabel mb={1}>Servings: </FormLabel>
            <NumberInput
              min={1}
              value={servings}
              onChange={(valueString) => setServings(parseInt(valueString))}
              width="100%"
              position="relative"
              bg="white"
            >
              <NumberInputStepper position="absolute" left="0">
                <IconButton
                  aria-label="Decrement"
                  icon={<MinusIcon />}
                  size="md"
                  onClick={() =>
                    setServings((prevServings) =>
                      prevServings > 1 ? prevServings - 1 : 1
                    )
                  }
                />
              </NumberInputStepper>
              <NumberInputField
                pl="2rem"
                pr="2rem"
                paddingLeft="53px"
                textAlign="center"
              />
              <NumberInputStepper position="absolute" right="4">
                <IconButton
                  aria-label="Increment"
                  icon={<AddIcon />}
                  size="md"
                  onClick={() =>
                    setServings((prevServings) => prevServings + 1)
                  }
                />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <Flex align="center" mb={1}>
            <FormLabel mb={1}>Preference:</FormLabel>
            <Input
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="I want something with BBQ sauce..."
              maxLength={200}
              width="100%"
              bg="white"
            />
          </Flex>
        </Box>
      </Box>
      <Box justifyContent="left" display="flex" alignItems="center" paddingLeft="4px">
      <Flex align="center">
        <Text paddingLeft="8px" mr={2}>
          Ingredients:
        </Text>
        <Stack direction="row" spacing={4} mt={2}>
          <Switch
            isChecked={!showExpiring}
            onChange={() => setShowExpiring(false)}
          />
          <Text>All</Text>
          <Switch
            isChecked={showExpiring}
            onChange={() => setShowExpiring(true)}
          />
          <Text>Expiring</Text>
        </Stack>
      </Flex>
      </Box>
      <Box
        mt={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        gap="0px"
        padding="0px 0px 0px 0px"
      >
        {isLoading ? (
          <Spinner />
        ) : (
          filteredInventory.map((item, index) => (
            <IngredientItem
              key={index}
              {...item}
              fetchInventoryItems={fetchInventoryItems}
              userId={userId}
              style={{ width: "100%", margin: 0, padding: 0 }}
            />
          ))
        )}
      </Box>
      <Button
        onClick={() => fetchRecommendedRecipes()}
        colorScheme="teal"
        mt={4}
        position="fixed"
        bottom="11%"
        left="50%"
        transform="translateX(-50%)"
        zIndex="10"
        px={8}
        py={6}
      >
        Generate Recipe
      </Button>
      <IconButton
        icon={<FaRegBookmark />}
        aria-label="Bookmark Recipes"
        position="fixed"
        bottom="11%"
        right="7%"
        zIndex="1000"
        colorScheme="teal"
        size="lg"
        isRound
        onClick={() => navigate("/saved-recipes")}
      />
      {selectedRecipe && (
        <RecipeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          recipe={selectedRecipe}
          userId={userId}
          onLogRecipe={(recipe) => console.log("Recipe logged:", recipe)}
        />
      )}
    </Box>
    </div>
  );
};

export default RecipeList;
