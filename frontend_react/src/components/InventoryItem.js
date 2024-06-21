import React, { useState } from 'react';
import { Button, Box, Text, Stack, Flex, Divider, useToast } from '@chakra-ui/react';
import EditItemForm from './EditItemForm';
import { apiUrl } from './IpAdr';

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

const InventoryItem = ({ id, item, category, quantity, purchase_date, expiry_date, onDecrement, onDelete, fetchInventoryItems, user_id }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Determine box color based on expiry
    const daysUntilExpiry = calculateDaysUntilExpiry(expiry_date);
    const boxColor = daysUntilExpiry <= 0 ? "red.300" : daysUntilExpiry <= 5 ? "orange.300" : "green.300";
    const wordHighlight = daysUntilExpiry <= 0 ? "red.300" : daysUntilExpiry <= 5 ? "orange.300" : "green.300";

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCloseEditForm = () => {
        setIsEditing(false);
    };

    // Function to get emoji by category
    const getEmoji = (category) => {
        return categoryEmojis[category] || "❓";
    };

    const newItem = {
        user_id,
        item,
        quantity,
        category,
        purchase_date,
        expiry_date,
    };

    const toast = useToast();
    const onUsed = async () => {
        try {

            const response = await fetch(`${apiUrl}/used_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([newItem]),
            });

            const result = await response.json();
            if (response.ok) {
                toast({
                    title: "Item used",
                    isClosable: true
                });
                fetchInventoryItems();
            } else {
                toast({
                    title: "Failed to Update Item",
                    isClosable: true
                });
            }

            const response2 = await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id,
                    item: id,
                    quantity: quantity,
                    category: category,
                    purchase_date: purchase_date,
                    expiry_date: expiry_date,
                }),
            });

            const result2 = await response2.json();

            if (response2.ok) {
                fetchInventoryItems();
            } else {
                toast({
                    title: "Failed to Update Item",
                    isClosable: true
                });
            }
        } catch (error) {
            toast({
                title: "Error Updating Item",
                isClosable: true
            });
        }
    };

    const onThrown = async () => {
        try {

            const response = await fetch(`${apiUrl}/thrown_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([newItem]),
            });

            const result = await response.json();
            if (response.ok) {
                toast({
                    title: "Item thrown away",
                    isClosable: true
                });
                fetchInventoryItems();
            } else {
                toast({
                    title: "Failed to Update Item",
                    isClosable: true
                });
            }

            const response2 = await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id,
                    item: id,
                    quantity: quantity,
                    category: category,
                    purchase_date: purchase_date,
                    expiry_date: expiry_date,
                }),
            });

            const result2 = await response2.json();

            if (response2.ok) {
                fetchInventoryItems();
            } else {
                toast({
                    title: "Failed to Update Item",
                    isClosable: true
                });
            }
        } catch (error) {
            toast({
                title: "Error Updating Item",
                isClosable: true
            });
        }
    };

    return (
        <Box
            className="inventory-item"
            p={0}
            borderWidth="0px"
            borderRadius="2xl"
            overflow="auto"
            borderColor="black"
            sx={{
                boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" // Custom shadow casting to the right and bottom
            }}
            width="200px"
        >
            <Box bg={boxColor} onClick={handleEdit} cursor="pointer">
                {!isEditing ? (
                    <Flex align="center" justify="flex-start" spacing="4">
                        <Text paddingLeft="6px" fontSize="5xl">{getEmoji(category)}</Text>
                        <Flex align="center" justify="left">
                            <Text w="full">
                                <Text fontSize="md" fontWeight="bold" ml="2" lineHeight="4" paddingTop={0.5}>{item}</Text>
                                <Divider height="1px" borderColor="transparent" />
                                <Text fontSize="xs" padding={0}>
                                    <Text as="span" fontWeight="bold" paddingLeft="1px">&nbsp;&nbsp;</Text>
                                    <Text as="span" fontWeight="bold" lineHeight="1">Amt: </Text>
                                    <Text as="span">{quantity}</Text>
                                </Text>
                            </Text>
                        </Flex>
                    </Flex>
                ) : (
                    <EditItemForm id={id} item={item} category={category} quantity={quantity} purchase_date={purchase_date} expiry_date={expiry_date} onClose={handleCloseEditForm} fetchInventoryItems={fetchInventoryItems} user_id={user_id} />
                )}
            </Box>
            <Box paddingLeft="0px">
                {!isEditing ? (
                    <>
                        <Text paddingLeft="12px" fontSize="sm" paddingTop="6px"><Text as="span" fontWeight="bold" >🛒: </Text><Text as="span">{purchase_date}</Text></Text>
                        <Text paddingLeft="12px" fontSize="sm" paddingTop="2px" paddingBottom="0px">
                            <Text as="span">🚮: </Text>
                            <Text as="span">{expiry_date}</Text>
                            <Text as="span" color={wordHighlight} fontWeight="bold" fontSize="xs"> ({daysUntilExpiry}d left)</Text>
                        </Text>
                        <Box display="flex" flexDirection="column" alignItems="center" w="full">
                        <Stack direction="row" spacing={5} mt={2}>
                            <Flex gap={2} align="center" paddingBottom="10px">
                                <Button bg="#EDF2F7" color="#888888" fontSize="sm" size="xs" width="85px" height="40px"  onClick={onUsed}>Used</Button>
                                <Button bg="red.200" color="black" fontSize="sm" size="xs" width="85px" height="40px"  onClick={onThrown}>Thrown</Button>
                            </Flex>
                        </Stack>
                        </Box>
                    </>
                ) : (
                    <EditItemForm id={id} item={item} category={category} quantity={quantity} purchase_date={purchase_date} expiry_date={expiry_date} onClose={handleCloseEditForm} fetchInventoryItems={fetchInventoryItems} user_id={user_id} />
                )}
            </Box>
        </Box>
    );
};

export default InventoryItem;
