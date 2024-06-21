import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Flex,
} from "@chakra-ui/react";
import { apiUrl } from "./IpAdr.js";

const categoryEmojis = {
  Fruit: "🍎",
  Vegetable: "🥦",
  Dairy: "🥛",
  Meat: "🍖",
  Grain: "🥐",
  Seafood: "🐟",
  Condiment: "🧂",
  "Dried Good": "🍪",
  "Canned Food": "🥫",
};

const Dashboard = ({ userId }) => {
  const [mostWastedItems, setMostWastedItems] = useState([]);
  const [mostUsedItems, setMostUsedItems] = useState([]);
  const [usedInfo, setUsedInfo] = useState([]);
  const [thrownInfo, setThrownInfo] = useState([]);

  const getEmoji = (category) => {
    return categoryEmojis[category] || "❓";
  };

  useEffect(() => {
    const fetchThrownInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/get_thrown_info/${userId}`);
        const data = await response.json();
        console.log("Fetched thrown info items:", data); // Debugging statement
        if (response.ok) {
          setThrownInfo(data);
        } else {
          throw new Error("Failed to fetch thrown info items");
        }
      } catch (error) {
        console.error("Error fetching thrown info items:", error);
      }
    };
    fetchThrownInfo();
  }, [userId]);

  useEffect(() => {
    const fetchUsedInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/get_used_info/${userId}`);
        const data = await response.json();
        console.log("Fetched used info items:", data); // Debugging statement
        if (response.ok) {
          setUsedInfo(data);
        } else {
          throw new Error("Failed to fetch used info items");
        }
      } catch (error) {
        console.error("Error fetching used info items:", error);
      }
    };
    fetchUsedInfo();
  }, [userId]);

  useEffect(() => {
    const fetchMostWastedItems = async () => {
      try {
        const response = await fetch(`${apiUrl}/get_most_wasted/${userId}`);
        const data = await response.json();
        console.log("Fetched most wasted items:", data); // Debugging statement
        if (response.ok) {
          setMostWastedItems(data);
        } else {
          throw new Error("Failed to fetch most wasted items");
        }
      } catch (error) {
        console.error("Error fetching most wasted items:", error);
      }
    };

    fetchMostWastedItems();
  }, [userId]);

  useEffect(() => {
    const fetchMostUsedItems = async () => {
      try {
        const response = await fetch(`${apiUrl}/get_most_used/${userId}`);
        const data = await response.json();
        console.log("Fetched most used items:", data); // Debugging statement
        if (response.ok) {
          setMostUsedItems(data);
        } else {
          throw new Error("Failed to fetch most used items");
        }
      } catch (error) {
        console.error("Error fetching most used items:", error);
      }
    };
    fetchMostUsedItems();
  }, [userId]);

  return (
    <Box p={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt="-30px"
      >
        <Image
          boxSize="30%"
          src="https://assets-global.website-files.com/5e51c674258ffe10d286d30a/5e5353e82b568af2d916cbbd_peep-26.svg"
        />
      </Box>
      <Box paddingBot="8px" paddingLeft="7px">
        <Text fontSize="xl" as="b">
          Overview
        </Text>
      </Box>
      <Box>
        <SimpleGrid columns={2} spacing="8px">
          <Stack>
            <Box
              sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
              borderRadius="2xl"
              p={2}
              borderWidth="0px"
              width="195px"
              height="100px"
              bg="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Flex>
                <Text fontSize="4xl">😋</Text>
                <Stack paddingLeft="10px">
                  <Text as="b" fontSize="2xl">
                    {usedInfo}
                  </Text>
                  <Text mt="-10px" fontSize="sm">
                    items finished
                  </Text>
                </Stack>
              </Flex>
            </Box>
          </Stack>
          <Stack>
            <Box
              sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
              borderRadius="2xl"
              p={5}
              borderWidth="0px"
              width="195px"
              height="100px"
              bg="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Flex>
                <Text fontSize="4xl">🗑</Text>
                <Stack paddingLeft="10px">
                  <Text as="b" fontSize="2xl">
                    {thrownInfo}
                  </Text>
                  <Text mt="-10px" fontSize="sm">
                    items thrown
                  </Text>
                </Stack>
              </Flex>
            </Box>
          </Stack>
          <Stack>
            <Box
              sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
              borderRadius="2xl"
              p={5}
              borderWidth="0px"
              width="195px"
              height="100px"
              bg="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Flex>
                <Text fontSize="4xl">📜</Text>
                <Stack paddingLeft="10px">
                  <Text as="b" fontSize="2xl">
                    2
                  </Text>
                  <Text mt="-10px" fontSize="sm">
                    recipes used
                  </Text>
                </Stack>
              </Flex>
            </Box>
          </Stack>
          <Stack>
            <Box
              sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
              borderRadius="2xl"
              p={5}
              borderWidth="0px"
              width="195px"
              height="100px"
              bg="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Flex>
                <Text fontSize="4xl">🛍</Text>
                <Stack paddingLeft="10px">
                  <Text as="b" fontSize="2xl">
                    420
                  </Text>
                  <Text mt="-10px" fontSize="sm">
                    items logged
                  </Text>
                </Stack>
              </Flex>
            </Box>
          </Stack>
        </SimpleGrid>
      </Box>
      <Box paddingTop="10px"></Box>
      <Box
        sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
        borderRadius="2xl"
        borderWidth="0px"
        width="400px"
        height="70px"
        bg="white"
        justifyContent="center"
        display="flex"
        alignItems="center"
      >
        <Text fontSize="4xl">💎</Text>
        <Stack
          spacing={0}
          justifyContent="center"
          display="flex"
          align="baseline"
          paddingLeft="10px"
        >
          <Text as="b" fontSize="lg" mb="-4px">
            $10
          </Text>
          <Text>rewards</Text>
        </Stack>
      </Box>
      <Box mt="20px" mb="8px">
        <Text paddingLeft="5px" fontSize="xl" as="b">
          Your top 3 most thrown groceries
        </Text>
      </Box>
      <Box
        sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
        borderRadius="2xl"
        borderWidth="0px"
        width="400px"
        height="120px"
        bg="white"
      >
        <Flex justifyContent="space-around" alignItems="center" height="100%">
          {mostWastedItems.map((item, index) => (
            <>
              <Box
                key={`item-${index}`}
                width="30%"
                height="100%"
                padding="10px"
                borderRadius="lg"
                textAlign="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Box width="100%" height="35%" overflow="hidden">
                  <Text
                    fontSize="lg"
                    as="b"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {item[0]}
                  </Text>
                </Box>
                <Box width="100%" height="45%" overflow="hidden">
                  <Text paddingLeft="6px" fontSize="3xl">
                    {getEmoji(item[1])}
                  </Text>
                </Box>
                <Box
                  width="100%"
                  height="20%"
                  overflow="hidden"
                  alignItems="center"
                  display="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm">Thrown: {item[2]}x</Text>
                </Box>
              </Box>
              {index < mostWastedItems.length - 1 && (
                <Box
                  key={`separator-${index}`}
                  width="1px"
                  height="100%"
                  bg="gray.300"
                />
              )}
            </>
          ))}
        </Flex>
      </Box>

      <Box mt="20px" mb="8px">
        <Text paddingLeft="5px" fontSize="xl" as="b" paddingBot="8px">
          Your top 3 most finished groceries
        </Text>
      </Box>
      <Box
        sx={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" }}
        borderRadius="2xl"
        borderWidth="0px"
        width="400px"
        height="120px"
        bg="white"
      >
        <Flex justifyContent="space-around" alignItems="center" height="100%">
          {mostUsedItems.map((item, index) => (
            <>
              <Box
                key={`item-${index}`}
                width="30%"
                height="100%"
                padding="10px"
                borderRadius="lg"
                textAlign="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Box width="100%" height="35%" overflow="hidden">
                  <Text fontSize="lg" as="b">
                    {item[0]}
                  </Text>
                </Box>
                <Box width="100%" height="45%" overflow="hidden">
                  <Text paddingLeft="6px" fontSize="3xl">
                    {getEmoji(item[1])}
                  </Text>
                </Box>
                <Box
                  width="100%"
                  height="25%"
                  overflow="hidden"
                  alignItems="center"
                  display="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm">Finished: {item[2]}x</Text>
                </Box>
              </Box>
              {index < mostUsedItems.length - 1 && (
                <Box
                  key={`separator-${index}`}
                  width="1px"
                  height="100%"
                  bg="gray.300"
                />
              )}
            </>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default Dashboard;
