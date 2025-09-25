import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DeliveryNotes from "./pages/DeliveryNotes";
import Invoices from "./pages/Invoices";
import CustomOrders from "./pages/CustomOrders";
import MatLocations from "./pages/MatLocations";
import SiteVisit from "./pages/SiteVisit";
import Statement from "./pages/Statement";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={ 
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } >
        </Route>
        <Route path="/register" element={<Register />} ></Route>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/f-password" element={<ForgotPassword />} ></Route>
        <Route path="/reset-password" element={<ResetPassword />} ></Route>
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
          } >
        </Route>
        <Route path="/edit/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
          } ></Route>
        <Route path="/delivery-notes" element={
          <ProtectedRoute>
            <DeliveryNotes />
          </ProtectedRoute>
        } ></Route>
        <Route path="/invoices" element={
          <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
        } ></Route>
        <Route path="/custom-orders" element={
          <ProtectedRoute>
            <CustomOrders />
          </ProtectedRoute>
        } ></Route>
        <Route path="/mat-locations" element={
          <ProtectedRoute>
            <MatLocations />
          </ProtectedRoute>
        } ></Route>
        <Route path="/site-visit" element={
          <ProtectedRoute>
            <SiteVisit />
          </ProtectedRoute>
        } ></Route>
        <Route path="/statement" element={
          <ProtectedRoute>
            <Statement />
          </ProtectedRoute>
        } ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
