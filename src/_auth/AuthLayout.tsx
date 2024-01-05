import { ThemeProvider } from "@/components/shared/theme-provider";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        {isAuthenticated ? (<Navigate to="/" />) : (<>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/OIG.jpeg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
        )}
      </>
    </ThemeProvider>
  )
}

export default AuthLayout