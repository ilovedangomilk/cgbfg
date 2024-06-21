import React from 'react';
import { Box, Stack, Flex, Text } from '@chakra-ui/react';

function Leaderboard() {
  const users = [
    { position: 1, name: 'You', score: 100 },
    { position: 2, name: 'Jack', score: 90 },
    { position: 3, name: 'Freddy', score: 80 },
    { position: 4, name: 'Wendy', score: 70 },
    { position: 5, name: 'Jerald', score: 60 },
    { position: 6, name: 'David', score: 50 },
    { position: 7, name: 'John', score: 40 },
    { position: 8, name: 'Ryan', score: 30 },
    { position: 9, name: 'Valerie', score: 20 },
    { position: 10, name: 'Cheryl', score: 10 },
    { position: 11, name: 'Lydia', score: 5 },
    { position: 12, name: 'Benjamin', score: 1},
    { position: 13, name: 'Fred', score: 0},
    { position: 14, name: 'Jack', score: 0},
    // Add more users as needed
  ];

  return (
    <Box justifyContent="center" alignItems="center" display="flex">
      <Stack width="95%" spacing="0x">
        <Box bg="#FFD25C" width="100%" borderTopLeftRadius="25px" borderTopRightRadius="25px">
          <Stack alignItems="center" justifyContent="center" gap="0px">
            <Box>
              <Flex alignItems="center">
                <Text fontSize="7xl">🥈</Text>
                <Text fontSize="8xl">🥇</Text>
                <Text fontSize="6xl">🥉</Text>
              </Flex>
            </Box>
            <Box>
              <Text fontSize="4xl" as='b'>Leaderboard</Text>
            </Box>
          </Stack>
        </Box>
        <Box bg="white">
          <Box justifyContent="center" alignContent="center" display="flex">
            <Flex justifyContent="space-between" width="98%" padding="8px">
              <Text flex="0.2" textAlign="center" fontSize="xl" as='b'>Position</Text>
              <Text flex="0.6" textAlign="center" fontSize="xl" as='b'>User</Text>
              <Text flex="0.2" textAlign="center" fontSize="xl" as='b'>Score</Text>
            </Flex>
          </Box>
          {users.map((user, index) => (
            <Flex justifyContent="space-between" width="100%" padding="8px" key={index} bg={user.name === "You" ? "green.500" : ""} borderRadius={user.name === "You" ? "25px" : "0"}>
              <Text flex="0.2" textAlign="center" fontSize="xl" as={user.position === 1 ? "b" : user.position === 2 ? "b" : user.position === 3 ? "b" : "black"} >{user.position}.</Text>
              <Text flex="0.6" textAlign="center" fontSize="xl" as={user.position === 1 ? "b" : user.position === 2 ? "b" : user.position === 3 ? "b" : "black"} >{user.name}</Text>
              <Text flex="0.2" textAlign="center" fontSize="xl" as={user.position === 1 ? "b" : user.position === 2 ? "b" : user.position === 3 ? "b" : "black"} >{user.score}</Text>
            </Flex>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}

export default Leaderboard;
