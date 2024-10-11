import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spinner, Text, Center } from "@chakra-ui/react";
import Items from "./Items";
import Navi from "./Navi";

const Start = () => {
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({
    latitude: undefined,
    longitude: undefined,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Spinner for fetching geolocation
  const [mode, setMode] = useState("ItemSearch"); // Spinner after fetching geolocation

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  // Parse URL query parameters and set them to state
  useEffect(() => {
    const long = query.get("long");
    const lat = query.get("lat");

    if (long && lat) {
      setLongitude(parseFloat(long));
      setLatitude(parseFloat(lat));
    }
  }, [search]);

  // Auto-fetch geolocation when the component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      setAvailable(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude });
          setLatitude(latitude); // Update latitude
          setLongitude(longitude); // Update longitude
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
      <Center height="100vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>現在位置を取得しています...</Text>
      </Center>
    );
  }

  // Render content based on mode after geolocation is fetched
  if (mode === "ItemSearch") {
    return <Items lat={latitude} long={longitude} />;
  }

  if (mode === "Navi") {
    return <Navi />;
  }

  // Optional: Handle fallback in case of invalid mode
  return <Text>Unknown mode: {mode}</Text>;
};

export default Start;
