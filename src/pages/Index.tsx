import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, Heart, Users, Zap, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,243,255,0.1),rgba(0,0,0,0))]" />
        </div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 backdrop-blur-sm border border-accent/20">
              <Zap className="h-4 w-4 text-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-accent">Next-Gen Blood Donor Platform</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Save Lives with
              <br />
              AI-Powered Matching
            </h1>
            
            <p className="mb-8 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              Ultra-accurate donor-recipient matching with real-time location tracking,
              health eligibility scoring, and instant emergency alerts
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow group"
              >
                <Droplet className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-primary-foreground/20 hover:bg-primary-foreground/10"
              >
                <Heart className="mr-2 h-5 w-5" />
                Find Donors
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Advanced Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Next-generation technology for life-saving connections
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<MapPin className="h-8 w-8 text-primary" />}
            title="Real-Time Location"
            description="GPS tracking with customizable distance filters from 10m to 5km+"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-accent" />}
            title="AI Matching"
            description="Smart eligibility scoring based on health conditions, blood type, and urgency"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-success" />}
            title="Health Verification"
            description="Secure medical data storage with comprehensive health screening"
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-secondary" />}
            title="SOS Alerts"
            description="Automated emergency notifications to nearest eligible donors"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Hospital Integration"
            description="Seamless connection with blood banks and medical facilities"
          />
          <FeatureCard
            icon={<Droplet className="h-8 w-8 text-accent" />}
            title="Gamification"
            description="Rewards, badges, and streaks for regular donors"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-card py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Ready to Save Lives?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of donors making a difference every day
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-emergency"
          >
            <Droplet className="mr-2 h-5 w-5" />
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass-card group rounded-2xl p-6 shadow-card transition-all hover:shadow-glow">
    <div className="mb-4 inline-flex rounded-xl bg-gradient-primary p-3 shadow-md group-hover:animate-pulse-glow">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
