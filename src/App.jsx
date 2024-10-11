import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navi from "./Components/Navi.jsx";
import Items from "./Components/Items.jsx";
import Start from "./components/Start";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/getNavigation" element={<Navi />} />
          <Route path="/getItems" element={<Items />} />
          <Route path="/startNavigation" element={<Start />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
