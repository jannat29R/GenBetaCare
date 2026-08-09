import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Messages from "../pages/Messages";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/admin" replace />}
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* Admin Layout */}
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          {/* /admin */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* /admin/products */}
          <Route
            path="products"
            element={<Products />}
          />

          {/* /admin/orders */}
          <Route
            path="orders"
            element={<Orders />}
          />

          {/* /admin/messages */}
          <Route
            path="messages"
            element={<Messages />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}