import React, { useState } from 'react';
import './AddItemForm.css';
import { apiUrl } from './IpAdr'; 
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Flex,
    Box,
    Spinner,
    IconButton,
    Stack,
    Text
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const AddItemForm = ({ onClose, fetchInventoryItems, user_id }) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        const newItem = {
            user_id, // Replace with actual user ID
            item,
            quantity,
            category,
            purchase_date: purchaseDate,
            expiry_date: expiryDate
        };
        
        try {
            const response = await fetch(`${apiUrl}/add_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([newItem]), // Send data as an array
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Item added successfully:", result);
                fetchInventoryItems(); // Fetch updated inventory items
                onClose(); // Close the form after successful submission
            } else {
                console.error("Failed to add item:", result.error);
                alert("Failed to add item: " + result.error);
            }
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Error adding item: " + error.message);
        } finally {
            setLoading(false); // Set loading to false after request is complete
        }
    };
    

    return (
        <Box className="add-item-form-container" p={4} boxShadow="md" rounded="md" bg="white">
            {loading && (
                
                <Flex justify="center" align="center" position="absolute" top="0" left="0" right="0" bottom="0" bg="rgba(255, 255, 255, 0.8)" zIndex="10">
                    <Spinner size="xl" color="teal.500" />
                </Flex>
            )}
            <Box display="flex" alignItems="center" justifyContent="center"><Text fontSize="2xl" as="b">Add an item</Text></Box>  
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel mb={1}>Item</FormLabel>
                        <Input type="text" value={item} onChange={(e) => setItem(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mb={1}>Quantity</FormLabel>
                        <NumberInput min={0} value={quantity} onChange={valueString => setQuantity(valueString)} position="relative">
                            <NumberInputStepper position="absolute" left="0">
                                <IconButton
                                    aria-label="Decrement"
                                    icon={<MinusIcon />}
                                    size="md"
                                    onClick={() => setQuantity((prevQuantity) => (parseInt(prevQuantity || "0") > 0 ? (parseInt(prevQuantity || "0") - 1).toString() : "0"))}
                                />
                            </NumberInputStepper>
                            <NumberInputField pl="2rem" pr="2rem" paddingLeft="53px" /> {/* Adjust padding to ensure space for steppers */}
                            <NumberInputStepper position="absolute" right="4">
                                <IconButton
                                    aria-label="Increment"
                                    icon={<AddIcon />}
                                    size="md"
                                    onClick={() => setQuantity((prevQuantity) => (parseInt(prevQuantity || "0") + 1).toString())}
                                />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mb={1}>Category</FormLabel>
                        <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Meat">Meat</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Fruit">Fruit</option>
                            <option value="Grain">Grain</option>
                            <option value="Seafood">Seafood</option>
                            <option value="Condiment">Condiment</option>
                            <option value="Dried Good">Dried Good</option>
                            <option value="Canned Food">Canned Food</option>
                        </Select>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mb={1}>Purchase Date</FormLabel>
                        <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mb={1}>Expiry Date</FormLabel>
                        <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    </FormControl>
                    <Flex mt={4} justifyContent="space-between">
                        <Button bg="#edf2f7" onClick={onClose} disabled={loading} color="#888888">Cancel</Button>
                        <Button bg="#19956d" type="submit" disabled={loading} color="white">Add Item</Button>
                    </Flex>
                </Stack>
            </form>
        </Box>
    );
};

export default AddItemForm;


