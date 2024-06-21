import React, { useState } from 'react';
import { Box, Text, Flex, Divider } from '@chakra-ui/react';

// Mapping categories to emojis
const categoryEmojis = {
    Fruit: "🍎",
    Vegetable: "🥦",
    Dairy: "🥛",
    Meat: "🍖",
    Grain: "🌾",
    Seafood: "🐟",
    Condiment: "🧂",
    "Dried Good": "🍪",
    "Canned Food": "🥫",
};

// Calculate days until expiry
const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Get box color and word highlight color based on expiry days
const getColorsBasedOnExpiry = (daysUntilExpiry) => {
    if (daysUntilExpiry <= 0) return { boxColor: "red.300", wordHighlight: "red.300" };
    if (daysUntilExpiry <= 5) return { boxColor: "orange.300", wordHighlight: "orange.300" };
    return { boxColor: "green.300", wordHighlight: "green.300" };
};

const IngredientItem = ({ id, item, category, quantity, purchase_date, expiry_date, fetchInventoryItems, user_id }) => {
    const [isEditing, setIsEditing] = useState(false);

    const daysUntilExpiry = calculateDaysUntilExpiry(expiry_date);
    const { boxColor, wordHighlight } = getColorsBasedOnExpiry(daysUntilExpiry);

    const getEmoji = (category) => {
        return categoryEmojis[category] || "❓";
    };

    return (
        <Box
            className="inventory-item"
            p={0}
            m={1} // Increased margin for distance between cards
            borderWidth="0px"
            borderRadius="2xl"
            overflow="hidden"
            borderColor="black"
            paddingLeft="18px"
            sx={{
                boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" // Custom shadow casting to the right and bottom
            }}
            width="95%" // Increased width of the card
            cursor="pointer"
        >
            <Flex alignItems="center"> {/* Align items center */}
                <Box 
                    bg={boxColor} 
                    width="80px" 
                    height="100%" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    borderRadius="md"
                >
                    <Text fontSize="5xl">{getEmoji(category)}</Text>
                </Box>
                    <Box paddingLeft="15px" paddingY="6px" flex="1">
                        <Text fontSize="md" fontWeight="bold">{item}</Text>
                        <Divider height="1px" borderColor="transparent" />
                        <Text fontSize="xs">
                            <Text as="span" fontWeight="bold">Amt: </Text>
                            <Text as="span">{quantity}</Text>
                        </Text>
                        <Text fontSize="xs">
                            <Text as="span" fontWeight="bold">🛒: </Text>
                            <Text as="span">{purchase_date}</Text>
                        </Text>
                        <Text fontSize="xs">
                            <Text as="span">🚮: </Text>
                            <Text as="span">{expiry_date}</Text>
                            <Text as="span" color={wordHighlight} fontWeight="bold"> ({daysUntilExpiry}d left)</Text>
                        </Text>
                    </Box>
            </Flex>
        </Box>
    );
};

export default IngredientItem;
