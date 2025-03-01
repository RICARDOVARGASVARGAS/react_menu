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
import ListRoles from "./pages/Role/ListRoles";
import ListUsers from "./pages/User/ListUsers";
import NoPermissionsPage from "./pages/NoPermissionsPage";
import Profile from "./pages/User/Profile";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Mover AuthProvider dentro del Router */}
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
          <Route
            path="/card-permit/:carId"
            element={
              <ProtectedRoute requiredPermissions={["car.cardPermit"]}>
                <CardPermit />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<MainLayout />}>
            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            ></Route>
            {/* Ruta con permisos específicos */}
            <Route
              path="/list-drivers"
              element={
                <ProtectedRoute requiredPermissions={["driver.index"]}>
                  <ListDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-driver"
              element={
                <ProtectedRoute requiredPermissions={["driver.create"]}>
                  <RegisterDriver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-data/:driverId"
              element={
                <ProtectedRoute requiredPermissions={["driver.edit"]}>
                  <DriverData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers/:driverId/view"
              element={
                <ProtectedRoute requiredPermissions={["driver.show"]}>
                  <DetailDriver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-cars"
              element={
                <ProtectedRoute requiredPermissions={["car.index"]}>
                  <ListCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cars/:carId/view"
              element={
                <ProtectedRoute requiredPermissions={["car.show"]}>
                  <DetailCar />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/card-permit/:carId"
              element={
                <ProtectedRoute requiredPermissions={["car.cardPermit"]}>
                  <CardPermit />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/settings/list-brands"
              element={
                <ProtectedRoute requiredPermissions={["brand.index"]}>
                  <ListBrands />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/list-years"
              element={
                <ProtectedRoute requiredPermissions={["year.index"]}>
                  <ListYears />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/list-examples"
              element={
                <ProtectedRoute requiredPermissions={["example.index"]}>
                  <ListExamples />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/list-groups"
              element={
                <ProtectedRoute requiredPermissions={["group.index"]}>
                  <ListGroups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/list-type-cars"
              element={
                <ProtectedRoute requiredPermissions={["type.index"]}>
                  <ListTypeCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/list-colors"
              element={
                <ProtectedRoute requiredPermissions={["color.index"]}>
                  <ListColors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-roles"
              element={
                <ProtectedRoute requiredPermissions={["role.index"]}>
                  <ListRoles />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/list-users"
              element={
                <ProtectedRoute requiredPermissions={["user.index"]}>
                  <ListUsers />
                </ProtectedRoute>
              }
            ></Route>
            {/* Pagina de no permiso */}
            <Route
              path="/no-permission-page"
              element={
                <ProtectedRoute>
                  <NoPermissionsPage />
                </ProtectedRoute>
              }
            ></Route>
          </Route>
          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Agregar ToastContainer en el componente raíz */}
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
};

export default App;
