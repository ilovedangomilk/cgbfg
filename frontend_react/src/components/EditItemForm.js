import React, { useState } from 'react';
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
  useToast,
  Stack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { apiUrl } from './IpAdr';
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const EditItemForm = ({ id, item: initialItem, category: initialCategory, quantity: initialQuantity, purchase_date: initialPurchaseDate, expiry_date: initialExpiryDate, onClose, fetchInventoryItems, user_id }) => {
    const [item, setItem] = useState(initialItem);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [category, setCategory] = useState(initialCategory);
    const [purchaseDate, setPurchaseDate] = useState(initialPurchaseDate);
    const [expiryDate, setExpiryDate] = useState(initialExpiryDate);

    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedItem = {
            user_id,
            item,
            quantity,
            category,
            purchase_date: purchaseDate,
            expiry_date: expiryDate
        };

        try {
            await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, item: id, purchase_date: initialPurchaseDate, expiry_date: initialExpiryDate }),
            });

            const response = await fetch(`${apiUrl}/add_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([updatedItem]),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Item Updated Successfully",
                    duration: 5000,
                });
                fetchInventoryItems();
                onClose();
            } else {
                toast({
                    title: "Failed to Update Item",
                    description: result.error,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        } catch (error) {
            toast({
                title: "Error Updating Item",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };

    return (
        <Box className="add-item-form-container" p={4} boxShadow="md" rounded="md" bg="white">
            <Box display="flex" alignItems="center" justifyContent="center"><Text fontSize="2xl" as="b">Edit an item</Text></Box>  
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
                        <Button bg="#edf2f7" color="#888888" onClick={onClose} >Cancel</Button>
                        <Button colorScheme="orange" type="submit" bg="#19956d">Edit Item</Button>
                    </Flex>
                </Stack>
            </form>
        </Box>
    );
};

export default EditItemForm;

