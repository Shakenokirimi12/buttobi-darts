import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Start from "./Components/Start.jsx";

function App() {
  return (
    <ChakraProvider>
      <Start />
    </ChakraProvider>
  );
}

export default App;
