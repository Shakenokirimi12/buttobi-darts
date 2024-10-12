import {
  Center,
  Spinner,
  Text,
  Box,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import postToGenerativeModel from "../llmRequest";

const Items = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const { longitude, latitude } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postToGenerativeModel({
          user_prompt: "目標の座標:" + longitude + "," + latitude,
        });

        // Split the response by '・' and filter out empty strings if any
        const items = response.split("・").filter((item) => item.trim() !== "");
        setItemList(items);
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemList(["データの取得に失敗しました。"]);
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
    <Center height="100vh" flexDirection="column" px={4}>
      <Box mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="teal.600">
          必要なものリスト
        </Text>
        <Text fontSize="md" color="gray.500">
          座標: {longitude}, {latitude}
        </Text>
      </Box>
      {itemList.length > 0 ? (
        <Box
          w="100%"
          maxW="500px"
          p={4}
          borderRadius="lg"
          boxShadow="lg"
          bg="gray.50"
        >
          <List spacing={3}>
            {itemList.map((item, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text>{item}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box p={4} bg="red.50" borderRadius="md" boxShadow="sm">
          <ListIcon as={WarningIcon} color="red.500" />
          <Text color="red.600">アイテムが見つかりませんでした。</Text>
        </Box>
      )}
    </Center>
  );
};

export default Items;
