import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { TournamentProvider } from "@/contexts/TournamentContext";
import "./index.css";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TournamentManagement from "@/pages/TournamentManagement.tsx";
import TournamentDisplay from "@/pages/TournamentDisplay.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <TournamentProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tournament" element={<TournamentManagement />} />
                <Route path="/tournament/display" element={<TournamentDisplay />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TournamentProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);