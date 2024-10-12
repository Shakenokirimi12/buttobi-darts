import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Spinner,
  Text,
  Center,
  Box,
  Icon,
  Button,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { MdError } from "react-icons/md";
import Items from "./Items";
import Navi from "./Navi";

const Start = () => {
  const [coordinates, setCoordinates] = useState({
    longitude: null,
    latitude: null,
  });
  const [currentCoordinates, setCurrentCoordinates] = useState({
    longitude: null,
    latitude: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("ItemSearch");

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  // Parse URL query parameters and set them to state
  useEffect(() => {
    const long = query.get("long");
    const lat = query.get("lat");

    if (long && lat) {
      setCoordinates({
        longitude: parseFloat(long),
        latitude: parseFloat(lat),
      });
    }
  }, [search]);

  // Auto-fetch geolocation when the component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoordinates({ latitude, longitude }); // Update current coordinates
          setLoading(false);
        },
        (error) => {
          setErrorMessage(`位置情報の取得に失敗しました。: ${error.message}`);
          setLoading(false);
        }
      );
    } else {
      setErrorMessage(
        "位置情報を取得できませんでした。許可設定をしたか再度確認してください。"
      );
      setLoading(false);
    }
  }, []);

  // Render loading spinner while fetching geolocation
  if (loading) {
    return (
      <Center height="100vh" width="100vw" bg="gray.50">
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="xl" color="gray.600">
            現在位置を取得しています...
          </Text>
        </VStack>
      </Center>
    );
  }

  // Show error message if geolocation fails
  if (errorMessage) {
    return (
      <Center height="100vh" width="100vw" bg="gray.50">
        <VStack spacing={6}>
          <Icon as={MdError} boxSize={12} color="red.500" />
          <Text color="red.500" fontSize="xl">
            {errorMessage}
          </Text>
          <Button colorScheme="red" onClick={() => window.location.reload()}>
            リロードして再試行
          </Button>
        </VStack>
      </Center>
    );
  }

  // Render content based on mode after geolocation is fetched
  return (
    <Flex
      direction="column"
      height="100vh"
      width="100vw"
      justify="center"
      align="center"
      bg="gray.100"
      p={4}
    >
      {/* Render different modes */}
      {mode === "ItemSearch" ? (
        <Items
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
        />
      ) : mode === "Navi" ? (
        <Navi />
      ) : (
        <Text fontSize="lg" color="red.600">
          Unknown mode: {mode}
        </Text>
      )}

      <Box mt={8}>
        <Button
          colorScheme="teal"
          onClick={() => setMode(mode === "ItemSearch" ? "Navi" : "ItemSearch")}
        >
          {mode === "ItemSearch"
            ? "ナビモードに切り替え"
            : "アイテム検索に戻る"}
        </Button>
      </Box>
    </Flex>
  );
};

export default Start;
