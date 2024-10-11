import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Start from "./Components/Start.jsx";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
