import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f9e9d1",
          minHeight: "500vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}