import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Flex,
  Button,
  Select,
} from '@chakra-ui/react';
import './EditReceiptItemForm.css'; // Assuming you have your CSS in this file

function EditReceiptItem({ item: initialItem, category: initialCategory, onSave, onClose }) {
  const [item, setItem] = useState(initialItem);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    console.log("initialCategory:", initialCategory);
  }, [initialCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prevItem => ({ ...prevItem, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...item, category });
  };

  return (
    <Box className="edit-receipt-item-form-container">
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <Text fontSize="2xl" as="b">
          Edit an item
        </Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel mb={1}>Item</FormLabel>
            <Input
              type="text"
              name="item"
              value={item.item}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={1}>Quantity</FormLabel>
            <Input
              type="text"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={1}>Category</FormLabel>
            <Select 
              value={category} 
              onChange={handleCategoryChange}
            >
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
            <Input
              type="date"
              name="purchase_date"
              value={item.purchase_date}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={1}>Expiry Date</FormLabel>
            <Input
              type="date"
              name="expiry_date"
              value={item.expiry_date}
              onChange={handleChange}
            />
          </FormControl>
          <Flex mt={4} justifyContent="space-between">
            <Button bg="#edf2f7" color="#888888" onClick={onClose}>Cancel</Button>
            <Button colorScheme="orange" type="submit" bg="#19956d">Edit Item</Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
}

export default EditReceiptItem;
