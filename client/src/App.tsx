import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Hakkimizda from "@/pages/hakkimizda";
import Programs from "@/pages/programs";
import ProgramDetail from "@/pages/program-detail";
import ProgramApplication from "@/pages/program-application";
import EventDetail from "@/pages/event-detail";
import EventApplication from "@/pages/event-application";
import TermsAndConditions from "@/pages/terms-and-conditions";
import Mentors from "@/pages/mentors";
import Startups from "@/pages/startups";
import Projects from "@/pages/projects";
import Events from "@/pages/events";
import Yonetim from "@/pages/yonetim";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import AuthPage from "@/pages/auth-page";
import ResetPassword from "@/pages/reset-password";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import AdminBlog from "@/pages/admin/blog";
import AdminTeam from "@/pages/admin/team";
import AdminProjects from "@/pages/admin/projects";
import AdminMentors from "@/pages/admin/mentors";
import AdminApplications from "@/pages/admin/applications";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hakkimizda" component={Hakkimizda} />
      <Route path="/programlar" component={Programs} />
      <Route path="/programlar/:id" component={ProgramDetail} />
      <Route path="/programlar/:id/basvuru" component={ProgramApplication} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/mentorlar" component={Mentors} />
      <Route path="/startuplar" component={Startups} />
      <Route path="/projeler" component={Projects} />
      <Route path="/yonetim" component={Yonetim} />
      <Route path="/etkinlikler" component={Events} />
      <Route path="/etkinlikler/:slug" component={EventDetail} />
      <Route path="/etkinlikler/:slug/basvuru" component={EventApplication} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/iletisim" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/applications" component={AdminApplications} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/team" component={AdminTeam} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/mentors" component={AdminMentors} />
      
      {/* English redirects for backwards compatibility */}
      <Route path="/programs" component={() => { window.location.href = "/programlar"; return null; }} />
      <Route path="/mentors" component={() => { window.location.href = "/mentorlar"; return null; }} />
      <Route path="/startups" component={() => { window.location.href = "/startuplar"; return null; }} />
      <Route path="/events" component={() => { window.location.href = "/etkinlikler"; return null; }} />
      <Route path="/contact" component={() => { window.location.href = "/iletisim"; return null; }} />
      <Route path="/admin/users">
        {() => {
          const UsersComponent = lazy(() => import("@/pages/admin/users"));
          return (
            <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itu-blue"></div></div>}>
              <UsersComponent />
            </Suspense>
          );
        }}
      </Route>
      <Route path="/admin/programs">
        {() => {
          const ProgramsComponent = lazy(() => import("@/pages/admin/programs"));
          return (
            <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itu-blue"></div></div>}>
              <ProgramsComponent />
            </Suspense>
          );
        }}
      </Route>
      <Route path="/admin/events">
        {() => {
          const EventsComponent = lazy(() => import("@/pages/admin/events"));
          return (
            <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itu-blue"></div></div>}>
              <EventsComponent />
            </Suspense>
          );
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
