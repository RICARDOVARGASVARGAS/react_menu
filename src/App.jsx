import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListDrivers from "./pages/Drivers/ListDrivers";
import RegisterDriver from "./pages/Drivers/RegisterDriver";
import { ToastContainer } from "react-toastify"; // Importar ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importar estilos de toast
import ListExamples from "./pages/Settings/Example/ListExample";
import ListBrands from "./pages/Settings/Brand/ListBrands";
import ListYears from "./pages/Settings/Year/ListYears";
import ListGroups from "./pages/Settings/Group/ListGroups";
import ListTypeCars from "./pages/Settings/TypeCar/ListTypeCars";
import ListColors from "./pages/Settings/Color/ListColors";
import MainLayout from "./components/layout/MainLayout";
import DriverData from "./pages/Drivers/DriverData";
import DetailDriver from "./pages/Drivers/DetailDriver";
import ListCars from "./pages/Cars/ListCars";
import DetailCar from "./pages/Cars/DetailCar";
import CardPermit from "./pages/Cars/CardPermit";
import Login from "./pages/Auth/Login";
import { AuthProvider } from "./hooks/AuthContext"; // Importa el AuthProvider
import PublicRoute from "./components/auth/PublicRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>

          {/* Ruta con permisos específicos */}
          <Route
            path="/settings/list-brands"
            element={
              <ProtectedRoute requiredPermissions={["brand.index"]}>
                <ListBrands />
              </ProtectedRoute>
            }
          />

          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* <Route path="/card-permit/:carId" element={<CardPermit />} /> */}

          {/* <Route path="/" element={<MainLayout />}>
            <Route path="*" element={<Home />} />

            <Route path="/list-drivers" element={<ListDrivers />} />
            <Route path="/register-driver" element={<RegisterDriver />} />
            <Route path="/driver-data/:driverId" element={<DriverData />} />
            <Route path="/drivers/:driverId/view" element={<DetailDriver />} />

            <Route path="/list-cars" element={<ListCars />} />
            <Route path="/cars/:carId/view" element={<DetailCar />} />

            <Route path="/settings/list-brands" element={<ListBrands />} />
            <Route path="/settings/list-years" element={<ListYears />} />
            <Route path="/settings/list-examples" element={<ListExamples />} />
            <Route path="/settings/list-groups" element={<ListGroups />} />
            <Route path="/settings/list-type-cars" element={<ListTypeCars />} />
            <Route path="/settings/list-colors" element={<ListColors />} />
          </Route> */}
        </Routes>

        {/* Agregar ToastContainer en el componente raíz */}
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
