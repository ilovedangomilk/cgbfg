import React, { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Link,
  HStack,
  Text,
  Stack,
  Center,
} from "@chakra-ui/react";
import AddItemForm from "./AddItemForm";

const BottomMenuBar = ({ fetchInventoryItems, user_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const toggleButtons = () => {
    setIsOpen(!isOpen);
  };

  const openForm = () => {
    setIsFormOpen(true);
    setIsOpen(false); // Close the floating buttons when form is opened
    closeMenu();
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleScanReceiptClick = () => {
    navigate("/scanner"); // Redirect to the camera page
    closeMenu();
  };

  const uploadReceipt = () => {
    navigate("/upload-receipt");
  };

  const getButtonBg = (path) => {
    return location.pathname === path ? "#cff1e6" : "white";
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      width="100%"
      bg="white"
      py={4}
      borderRadius="25px 25px 0 0"
      height="85px"
      zIndex="20"
      boxShadow="dark-lg"
    >
      <Flex justify="space-around" alignItems="center" height="100%">
        <Link as={RouterLink} to="/groceries" textDecoration="none">
          <Button
            bg={getButtonBg("/groceries")}
            align="center"
            color="#4A4A4A"
            borderRadius="25px"
            width="80px"
            height="50px"
            _hover={{ bg: "#cff1e6" }}
          >
            <Stack spacing={0}>
              <Text>🛒</Text>
              <Text fontSize="xs" paddingTop="5px">
                Groceries
              </Text>
            </Stack>
          </Button>
        </Link>
        <Link as={RouterLink} to="/recipes" textDecoration="none">
          <Button
            bg={getButtonBg("/recipes")}
            color="#4A4A4A"
            borderRadius="25px"
            width="80px"
            height="50px"
            _hover={{ bg: "#cff1e6" }}
          >
            <Stack spacing={0}>
              <Text>📜</Text>
              <Text fontSize="xs" paddingTop="5px">
                Recipes
              </Text>
            </Stack>
          </Button>
        </Link>
        <Button
          bg="#19956d"
          _hover={{ bg: "#cff1e6" }}
          width="50px"
          height="50px"
          borderWidth="1px"
          borderRadius="25px"
          display="flex"
          zIndex="20"
          justifyContent="center"
          alignItems="center"
          onClick={toggleButtons}
          p={0}
        >
          <Box
            width="50%"
            height="2px"
            backgroundColor="white"
            position="absolute"
          />
          <Box
            height="50%"
            width="2px"
            backgroundColor="white"
            position="absolute"
          />
        </Button>
        <Link as={RouterLink} to="/dashboard" textDecoration="none">
          <Button
            bg={getButtonBg("/dashboard")}
            color="#4A4A4A"
            borderRadius="25px"
            width="80px"
            height="50px"
            _hover={{ bg: "#cff1e6" }}
          >
            <Stack spacing={0}>
              <Text>👤</Text>
              <Text fontSize="xs" paddingTop="5px">
                Profile
              </Text>
            </Stack>
          </Button>
        </Link>
        <Link as={RouterLink} to="/community" textDecoration="none">
          <Button
            bg={getButtonBg("/community")}
            color="#4A4A4A"
            borderRadius="25px"
            width="80px"
            height="50px"
            _hover={{ bg: "#cff1e6" }}
          >
            <Stack spacing={0}>
              <Text>🌏</Text>
              <Text fontSize="xs" paddingTop="5px">
                Community
              </Text>
            </Stack>
          </Button>
        </Link>
      </Flex>

      {isOpen && (
        <HStack
          position="absolute"
          bottom="100px"
          width="100%"
          justify="center"
          spacing={2}
        >
          <Button
            bg="#19956d"
            color="white"
            borderRadius="20px"
            width="190px"
            height="60px"
            onClick={openForm}
            _hover={{ bg: "#19956d" }}
          >
            Add item
          </Button>
          <Button
            bg="#19956d"
            color="white"
            borderRadius="20px"
            width="190px"
            height="60px"
            onClick={handleScanReceiptClick}
            _hover={{ bg: "#19956d" }}
          >
            Scan receipt
          </Button>
        </HStack>
      )}

      {isFormOpen && (
        <AddItemForm
          onClose={closeForm}
          fetchInventoryItems={fetchInventoryItems}
          user_id={user_id}
        />
      )}
    </Box>
  );
};

export default BottomMenuBar;
