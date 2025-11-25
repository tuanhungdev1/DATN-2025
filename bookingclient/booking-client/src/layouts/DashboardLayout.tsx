import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Calendar,
  Users,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Scale,
  Blocks,
  ContactRound,
  School,
  CreditCard,
  BadgePercent,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { AppImage } from "@/components/images";
import { useLogoutMutation } from "@/services/endpoints/auth.api";
import { persistor } from "@/store";
import { useToast } from "@/hooks/useToast";

import USER_DEFAULT_AVATAR from "@/assets/default_user_avatar.png";
import { ROUTES } from "@/constants/routes/routeConstants";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Bảng điều khiển",
    path: ROUTES.ADMIN_DASHBOARD,
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Homestay",
    path: ROUTES.ADMIN_HOMESTAYS,
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Tiện nghi",
    path: ROUTES.ADMIN_AMENITIES,
    icon: <Blocks className="w-5 h-5" />,
  },
  {
    name: "Nội quy",
    path: ROUTES.ADMIN_RULES,
    icon: <Scale className="w-5 h-5" />,
  },
  {
    name: "Loại bất động sản",
    path: ROUTES.ADMIN_PROPERTY_TYPES,
    icon: <School className="w-5 h-5" />,
  },
  {
    name: "Đặt phòng",
    path: ROUTES.ADMIN_BOOKINGS,
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    name: "Giao dịch",
    path: ROUTES.ADMIN_PAYMENTS,
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    name: "Chủ nhà",
    path: ROUTES.ADMIN_HOSTS,
    icon: <ContactRound className="w-5 h-5" />,
  },
  {
    name: "Khách hàng",
    path: ROUTES.ADMIN_USERS,
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Khuyến mãi",
    path: ROUTES.ADMIN_COUPONS,
    icon: <BadgePercent className="w-5 h-5" />,
  },
  {
    name: "Đánh giá",
    path: ROUTES.ADMIN_REVIEWS,
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const toast = useToast();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();

      if (result.success) {
        await persistor.purge();

        toast.success("Đăng xuất thành công!");
        navigate("/admin/login");
      }
    } catch (err) {
      console.error("Đăng xuất thất bại:", err);
      toast.error("Đăng xuất không thành công. Vui lòng thử lại sau.");
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <Link to={"/"}>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center">
                  <img src="/src/assets/NextStayLogo.svg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">NextStay</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive(item.path)
                          ? "bg-blue-600 text-white font-medium shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <span
                      className={`
                      ${isActive(item.path) ? "text-white" : "text-gray-400"}
                    `}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-400">
            <button
              className="
                flex items-center space-x-3 px-4 py-3 rounded-lg w-full
                text-gray-700 hover:bg-red-50 hover:text-red-600
                transition-all duration-200
              "
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br overflow-hidden bg-gray-400 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <AppImage src={user?.avatar} alt="Avata" />
                  ) : (
                    <AppImage src={USER_DEFAULT_AVATAR} alt="Avatar" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-2">
          <div className="mx-auto"> {<Outlet />}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
