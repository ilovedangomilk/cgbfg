import React from 'react';
import './LoadingPage.css';
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

function Loading() {
  return (
    <div className="loading">
      <Text fontSize="2xl" paddingBottom="40px" color="black" as='b'>Processing goodness...</Text>
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;