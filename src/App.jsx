import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListDrivers from "./pages/Drivers/ListDrivers";
import RegisterDriver from "./pages/Drivers/RegisterDriver";
import EditDriver from "./pages/Drivers/EditDriver";
import { ToastContainer } from "react-toastify"; // Importar ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importar estilos de toast

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-drivers" element={<ListDrivers />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/edit-driver/:driverId" element={<EditDriver />} />
        <Route path="*" element={<Home />} /> {/* Redirige rutas desconocidas */}
      </Routes>

      {/* Agregar ToastContainer en el componente raíz */}
      <ToastContainer />
    </Router>
  );
};

export default App;
