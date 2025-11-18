import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplet, MapPin, Award, Heart, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DonorDashboardProps {
  profile: any;
}

const DonorDashboard = ({ profile }: DonorDashboardProps) => {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [locationStatus, setLocationStatus] = useState<"inactive" | "active">("inactive");
  const [nearbyRequests, setNearbyRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchDonorStats();
    fetchNearbyRequests();
  }, []);

  const fetchDonorStats = async () => {
    const { data, error } = await supabase
      .from("donor_stats")
      .select("*")
      .eq("donor_id", profile.id)
      .single();

    if (error) {
      console.error("Error fetching donor stats:", error);
    } else if (!data) {
      // Create initial stats if they don't exist
      const { data: newStats } = await supabase
        .from("donor_stats")
        .insert({ donor_id: profile.id })
        .select()
        .single();
      setStats(newStats);
    } else {
      setStats(data);
    }
  };

  const fetchNearbyRequests = async () => {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setNearbyRequests(data);
    }
  };

  const toggleLocationSharing = async () => {
    if (locationStatus === "inactive") {
      // Request location permission
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const { error } = await supabase
              .from("donor_locations")
              .upsert({
                donor_id: profile.id,
                latitude,
                longitude,
                status: "available",
                is_visible: true,
              });

            if (error) {
              toast({
                variant: "destructive",
                title: "Location update failed",
                description: error.message,
              });
            } else {
              setLocationStatus("active");
              toast({
                title: "Location sharing enabled",
                description: "You're now visible to people in need!",
              });
            }
          },
          (error) => {
            toast({
              variant: "destructive",
              title: "Location access denied",
              description: "Please enable location services to continue.",
            });
          }
        );
      }
    } else {
      // Disable location sharing
      const { error } = await supabase
        .from("donor_locations")
        .update({ is_visible: false, status: "unavailable" })
        .eq("donor_id", profile.id);

      if (!error) {
        setLocationStatus("inactive");
        toast({
          title: "Location sharing disabled",
          description: "Your location is no longer visible.",
        });
      }
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-emergency text-emergency-foreground";
      case "high":
        return "bg-secondary text-secondary-foreground";
      case "medium":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Droplet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_donations || 0}</div>
            <p className="text-xs text-muted-foreground">Life-saving contributions</p>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lives Saved</CardTitle>
            <Heart className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.lives_saved || 0}</div>
            <p className="text-xs text-muted-foreground">People helped</p>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.points || 0}</div>
            <p className="text-xs text-muted-foreground">Level {stats?.level || 1}</p>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.streak_days || 0}</div>
            <p className="text-xs text-muted-foreground">Days active</p>
          </CardContent>
        </Card>
      </div>

      {/* Location Sharing */}
      <Card className="glass-card shadow-card">
        <CardHeader>
          <CardTitle>Location Sharing</CardTitle>
          <CardDescription>
            Enable to let people in need find you based on proximity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Status:{" "}
                <Badge
                  variant={locationStatus === "active" ? "default" : "secondary"}
                  className={locationStatus === "active" ? "bg-success" : ""}
                >
                  {locationStatus === "active" ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <Button
              onClick={toggleLocationSharing}
              variant={locationStatus === "active" ? "outline" : "default"}
              className={locationStatus === "inactive" ? "bg-accent hover:bg-accent/90" : ""}
            >
              {locationStatus === "active" ? "Disable" : "Enable"} Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Requests */}
      <Card className="glass-card shadow-card">
        <CardHeader>
          <CardTitle>Nearby Blood Requests</CardTitle>
          <CardDescription>People in your area who need help</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {nearbyRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active requests nearby</p>
          ) : (
            nearbyRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency}
                    </Badge>
                    <span className="font-semibold">{request.blood_type_needed}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.units_needed} unit{request.units_needed > 1 ? "s" : ""} needed
                  </p>
                  <p className="text-xs text-muted-foreground">{request.location_name}</p>
                </div>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                  Respond
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard;
