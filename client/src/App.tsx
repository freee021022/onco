import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { I18nProvider } from "./lib/i18n";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileNavigation from "./components/layout/MobileNavigation";
import Home from "./pages/Home";
import Forum from "./pages/Forum";
import SecondOpinion from "./pages/SecondOpinion";
import Pharmacies from "./pages/Pharmacies";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/forum" component={Forum} />
      <Route path="/second-opinion" component={SecondOpinion} />
      <Route path="/pharmacies" component={Pharmacies} />
      <Route path="/about" component={AboutUs} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
              <MobileNavigation />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
