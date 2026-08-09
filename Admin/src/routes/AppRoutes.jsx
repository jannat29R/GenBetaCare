import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Messages from "../pages/Messages";
import Login from "../pages/Login";

import AdminProtectedRoute from "../components/AdminProtectedRoute";


export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            ADMIN 
        ========================= */}

        <Route
            path="/"
            element={<Navigate to="/admin" replace />}
          />

          {/* =========================
              ADMIN LOGIN
          ========================= */}
          <Route
            path="/admin/login"
            element={<Login />}
          />

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="messages"
            element={<Messages />}
          />
      </Routes>

    </BrowserRouter>

  );

}
