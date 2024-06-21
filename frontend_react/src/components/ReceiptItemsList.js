import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from './IpAdr'; 
import {
  Box,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalBody,
  Text,
  Stack,
} from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';
import IngredientItem from './IngredientItem';
import EditReceiptItem from './EditReceiptItem';

function ItemsList({ userId, fetchInventoryItems }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState(location.state.items);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editItemCategory, setEditItemCategory] = useState(null);

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCamera = () => {
    navigate('/scanner');
  };

  const handleEdit = (index) => {
    setEditItemIndex(index);
    setEditItem(items[index]);
    setEditItemCategory(items[index].category);
    onOpen();
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`${apiUrl}/upload_items/${userId}`, { items });
      await fetchInventoryItems();
      navigate('/groceries');
    } catch (error) {
      console.error("Error uploading items:", error);
    }
  };

  const handleSave = (updatedItem) => {
    const updatedItems = items.map((it, idx) => idx === editItemIndex ? updatedItem : it);
    setItems(updatedItems);
    onClose();
  };

  return (
    <Box>
      <Box alignItems="center" justifyContent="center" display="flex">
        <Stack align="center" justify="center" spacing={0}>
        <Text fontSize="6xl">✅</Text>
        <Text fontSize="2xl" as = 'b'>Success!</Text>
        </Stack>
      </Box>
      <Box alignItems="center" justifyContent="center" display="flex">
        <Box width="95%" alignItems="center" justifyContent="center" display="flex">
          <Text fontSize="lg" >Is this right? Tap an item to edit or press the delete button on the right!</Text>
        </Box>
      </Box>
      <Box 
        mt={2}   
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        width="100%"
        gap="0px"
        padding="0px 0px"
      >
        {items.map((item, index) => (
          <Box
            key={index}
            width="100%"
            position="relative"  // Set the container position to relative
            cursor="pointer"
            mb={0}  // Add margin to separate the items
          >
            <Box onClick={() => handleEdit(index)} width="100%">
              <IngredientItem 
                {...item} 
                userId={userId} 
                style={{ width: '100%', margin: 0, padding: 0 }}
              />
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => handleDelete(index)}
              aria-label="Delete item"
              variant="ghost"
              position="absolute"  // Position the button absolutely within the container
              right="30px"  // Position the button to the right
              top="50%"  // Center the button vertically
              transform="translateY(-50%)"  // Adjust vertical position
            />
          </Box>
        ))}
        <Flex alignItems="center" justifyContent="space-between" display="flex" width="95%" mt={2}>
          <Button bg="#edf2f7" color="#888888" onClick={handleCamera}>Scan again</Button>  
          <Button bg="#19956d" color="white"  onClick={handleConfirm}>Confirm</Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <Box>
          <ModalBody>
            {editItem && (
              <EditReceiptItem
                item={editItem}
                index={editItemIndex}
                items={items}
                onSave={handleSave}
                onClose={onClose}
                category={editItemCategory}
              />
            )}
          </ModalBody>
        </Box>
      </Modal>
    </Box>
  );
}

export default ItemsList;
