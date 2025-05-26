import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthGuard, { AUTH_TOKEN_KEY } from "@/hooks/useAuthGuard";

const Dashboard = () => {
  useAuthGuard();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = "/login?logout=true";
  };

  return (
    <section className="flex h-full w-full gap-3 p-2">
      {/* Navigation Sidebar */}
      <div
        className={`p-4 overflow-hidden transform transition-[width] duration-500 ease-in-out bg-white/10 flex flex-col rounded-xl gap-2 backdrop-blur-md h-full ${
          isCollapsed ? " w-10" : "w-[140px]"
        }`}
      >
        <button onClick={() => setIsCollapsed((prev) => !prev)}>
          <h3 className="text-2xl float-right">{isCollapsed ? "+" : "x"}</h3>
        </button>

        <nav
          className={`flex flex-col transform transition duration-500 ${
            isCollapsed
              ? "opacity-0 -translate-x-20"
              : "opacity-100 translate-x-0"
          }`}
        >
          <Link to="home">Home</Link>
          <Link to="dashboard">Dashboard</Link>
          <Link to="payment">Payment</Link>
          <Link to="login">Login</Link>
        </nav>
      </div>

      <div className="bg-white/10 rounded-xl backdrop-blur-md p-8 flex-grow">
        <div className="flex justify-between">
          <h3>Dashboard</h3>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
