import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/dark-mode/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/utils/protectedRoutes";
<<<<<<< HEAD
import { SegmentToggleProvider } from "./context/SegmentToggleContext";
import { SegmentDataProvider } from "./context/SegmentDataContext";
import { LifecycleContextProvider } from "./context/LifecycleContext";
import { SyncContextProvider } from "./context/SyncContext";
import { AiChatContextProvider } from "./context/AiChatContext";
=======
>>>>>>> 82912c6 (update admin)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
<<<<<<< HEAD
        <SegmentToggleProvider>
          <SegmentDataProvider>
            <LifecycleContextProvider>
              <MicroSegmentationProvider>
                <SyncContextProvider>
                  <AiChatContextProvider>
                    <BrowserRouter>
                      <AuthProvider>
                        <ProtectedRoutes />
                      </AuthProvider>
                    </BrowserRouter>
                  </AiChatContextProvider>
                </SyncContextProvider>
              </MicroSegmentationProvider>
            </LifecycleContextProvider>
          </SegmentDataProvider>
        </SegmentToggleProvider>
=======
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoutes />
          </AuthProvider>
        </BrowserRouter>
>>>>>>> 82912c6 (update admin)
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
