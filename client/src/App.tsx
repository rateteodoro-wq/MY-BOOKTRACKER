import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MaintenanceMode from "./pages/MaintenanceMode";
import ConstructionMode from "./pages/ConstructionMode";
import Settings from "./pages/Settings";
import SessionHistory from "./pages/SessionHistory";
import Milestones from "./pages/Milestones";
import AIAssistant from "./pages/AIAssistant";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/maintenance"} component={MaintenanceMode} />
      <Route path={"/construction"} component={ConstructionMode} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/history"} component={SessionHistory} />
      <Route path={"/milestones"} component={Milestones} />
      <Route path={"/ai"} component={AIAssistant} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
