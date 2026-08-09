import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Messages from "../pages/Messages";
import Login from "../pages/Login";

import AdminProtectedRoute from "../Components/AdminProtectedRoute";


export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            ADMIN LOGIN
        ========================= */}

        <Route
          path="/admin/login"
          element={<Login />}
        />


        {/* =========================
            PROTECTED ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >

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

        </Route>


      </Routes>

    </BrowserRouter>

  );

}