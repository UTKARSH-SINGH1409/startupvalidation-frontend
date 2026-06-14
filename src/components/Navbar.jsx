import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Lightbulb, User, LogOut, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "./theme-provider";

function Navbar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userName");
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b border-border shadow-sm px-6 py-3 flex justify-between items-center transition-all duration-300">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-extrabold text-foreground sm:block font-heading">
          StartupIQ
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 md:gap-2">
        <NavLink to="/dashboard">
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
          )}
        </NavLink>

        <NavLink to="/feed">
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Globe className="size-4" />
              Feed
            </Button>
          )}
        </NavLink>

        <NavLink to="/myideas">
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Lightbulb className="size-4" />
              My Ideas
            </Button>
          )}
        </NavLink>

        <NavLink to="/profile">
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <User className="size-4" />
              Profile
            </Button>
          )}
        </NavLink>

        <Separator orientation="vertical" className="mx-2 h-6 hidden sm:block" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
          className="px-2"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Logout Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;