import { useState } from "react";
import { Outlet } from "react-router-dom";
import ManagerNavbar from "@/components/Manager/ManagerNavbar";
import ManagerSidebar from "@/components/Manager/ManagerSidebar";

function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-muted/30">
      <ManagerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <ManagerNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ManagerLayout;
