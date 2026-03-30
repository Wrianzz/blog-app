import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function navClass(isActive: boolean) {
  return [
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
    isActive
      ? "bg-black text-white"
      : "text-gray-600 hover:bg-gray-100"
  ].join(" ");
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="grid min-h-screen grid-cols-[230px_1fr]">
        <aside className="sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="h-20 flex items-center px-6 border-b border-gray-200 shrink-0">
            <Link to="/" className="text-xl font-bold tracking-tight">
              FW. Admin
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavLink to="/admin/posts" end className={({ isActive }) => navClass(isActive)}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <NavLink to="/admin/posts" className={({ isActive }) => navClass(isActive)}>
              <FileText className="w-5 h-5" />
              Posts
            </NavLink>

            <NavLink to="/admin/settings" className={({ isActive }) => navClass(isActive)}>
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2 shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>

            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Site
            </Link>
          </div>
        </aside>

        <main className="min-h-screen overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-8">
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Logged in as {user?.email}
              </p>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}