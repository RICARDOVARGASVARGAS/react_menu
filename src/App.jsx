import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListDrivers from "./pages/Drivers/ListDrivers";
// import ListDrivers from "./pages/ListDrivers";
// import RegisterDriver from "./pages/RegisterDriver";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-drivers" element={<ListDrivers />} />
        {/* <Route path="/drivers" element={<ListDrivers />} />
        <Route path="/drivers/register" element={<RegisterDriver />} /> */}
        <Route path="*" element={<Home />} /> {/* Redirige rutas desconocidas */}
      </Routes>
    </Router>
  );
};

export default App;
