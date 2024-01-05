import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/shared/theme-provider"
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";

const RootLayout = () => {
  return (
   
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="w-full md:flex">
          <Topbar />
          <LeftSidebar />
          <section className="flex flex-1 h-full">
            <Outlet />
          </section>
          <Bottombar />
        </div>
      </ThemeProvider>

  );
};

export default RootLayout;