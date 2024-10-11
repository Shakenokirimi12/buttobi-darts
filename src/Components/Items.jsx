import { Center, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import postToGenerativeModel from "../llmRequest";

const Items = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [itemList, setItemList] = useState("");
  const { long: longitude, lat: latitude } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postToGenerativeModel(
          `目標の座標:${longitude},${latitude}`
        );
        setItemList(response);
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemList("データの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [longitude, latitude]);

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="green.500" />
        <Text ml={4}>必要なものを考えています...</Text>
      </Center>
    );
  }

  return (
    <Center height="100vh">
      <Text ml={4}>必要なものは以下です。</Text>
      <br />
      <Text ml={4}>{itemList}</Text>
    </Center>
  );
};

export default Items;
