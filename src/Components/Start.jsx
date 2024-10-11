import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spinner, Box, Text, Button, Center } from "@chakra-ui/react";

const Start = () => {
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Spinner for fetching geolocation
  const [finalLoading, setFinalLoading] = useState(false); // Spinner after fetching geolocation

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  // Parse URL query parameters and set them to state
  useEffect(() => {
    setLongitude(query.get("long"));
    setLatitude(query.get("lat"));
  }, [search]);

  // Auto-fetch geolocation when the component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      setAvailable(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude });
          setLoading(false);
          setFinalLoading(true);

          // Simulate a brief spinner after fetching the location
          setTimeout(() => setFinalLoading(false), 2000);
        },
        (error) => {
          setErrorMessage(`Error fetching position: ${error.message}`);
          setLoading(false);
        }
      );
    } else {
      setErrorMessage("Geolocation is not available in this browser.");
      setLoading(false);
    }
  }, []);

  // Render loading spinner while fetching geolocation
  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>現在位置を取得しています...</Text>
      </Center>
    );
  }

  // Render second spinner briefly after geolocation is fetched
  if (finalLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="green.500" />
        <Text ml={4}>必要なものを考えています...</Text>
      </Center>
    );
  }
  ï;
  return (
    <>
      <Box textAlign="center" mt={8}>
        {errorMessage ? (
          <Text color="red.500">{errorMessage}</Text>
        ) : (
          <>
            <Text>Your longitude from URL: {longitude}</Text>
            <Text>Your latitude from URL: {latitude}</Text>
            <Box mt={4}>
              <Text>
                Latitude:{" "}
                {position.latitude ? position.latitude : "Not available"}
              </Text>
              <Text>
                Longitude:{" "}
                {position.longitude ? position.longitude : "Not available"}
              </Text>
            </Box>
          </>
        )}
      </Box>
      <Center mt={8}>
        <Button onClick={() => window.location.reload()}>
          Reload Position
        </Button>
      </Center>
    </>
  );
};

export default Start;
