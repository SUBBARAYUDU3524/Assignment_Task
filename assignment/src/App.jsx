import { Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./Login";
import SignupForm from "./Signup";
import Dashboard from "./Dashboard";
import EmployeeList from "./components/EmployeeList";
import CreateEmployee from "./components/CreateEmployee";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectiveRoute from "./ProtectiveRoute";

function App() {
  const location = useLocation();

  const showNavbar = [
    "/dashboard",
    "/create-employee",
    "/employee-list",
  ].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route element={<ProtectiveRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
          <Route path="/employee-list" element={<EmployeeList />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
