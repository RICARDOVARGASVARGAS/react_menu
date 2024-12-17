import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListDrivers from "./pages/Drivers/ListDrivers";
import RegisterDriver from "./pages/Drivers/RegisterDriver";
import EditDriver from "./pages/Drivers/EditDriver";
import DetailDriver from "./pages/Drivers/DetailDriver";
import ListCars from "./pages/Cars/ListCars";
import DetailCar from "./pages/Cars/DetailCar";
import { ToastContainer } from "react-toastify"; // Importar ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importar estilos de toast
import ListExamples from "./pages/Settings/Example/ListExample";
import ListBrands from "./pages/Settings/Brand/ListBrands";
import ListYears from "./pages/Settings/Year/ListYears";
import ListGroups from "./pages/Settings/Group/ListGroups";
import ListTypeCars from "./pages/Settings/TypeCar/ListTypeCars";
import ListColors from "./pages/Settings/Color/ListColors";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-drivers" element={<ListDrivers />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/edit-driver/:driverId" element={<EditDriver />} />
        <Route path="/drivers/:driverId/view" element={<DetailDriver />} />
        {/* VEHICULOS */}
        <Route path="/list-cars" element={<ListCars />} />
        <Route path="/cars/:carId/view" element={<DetailCar />} />
        <Route path="*" element={<Home />} />

        {/* Settings */}
        <Route path="/settings/list-examples" element={<ListExamples />} />
        <Route path="/settings/list-brands" element={<ListBrands />} />
        <Route path="/settings/list-years" element={<ListYears />} />
        <Route path="/settings/list-groups" element={<ListGroups />} />
        <Route path="/settings/list-type-cars" element={<ListTypeCars />} />
        <Route path="/settings/list-colors" element={<ListColors />} />
        {/* Redirige rutas desconocidas */}
      </Routes>

      {/* Agregar ToastContainer en el componente raíz */}
      <ToastContainer />
    </Router>
  );
};

export default App;
