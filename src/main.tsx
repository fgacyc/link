import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MainRoutes } from "./routes/MainRoutes";

import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "react-hot-toast";
import { AuthDebugButton } from "./components/AuthDebugButton";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      gutter={4}
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: "2px",
          border: "1px solid #41FAD3",
          color: "black",
          padding: "0.25rem 0.5rem",
          fontFamily: "Inter",
          fontSize: "14px",
        },
      }}
    />
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools
          buttonPosition="bottom-left"
          initialIsOpen={false}
        />
        <MainRoutes />
      </QueryClientProvider>
      <AuthDebugButton />
    </BrowserRouter>
  </StrictMode>,
);
