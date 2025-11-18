import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, AlertCircle } from "lucide-react";

interface RecipientDashboardProps {
  profile: any;
}

const RecipientDashboard = ({ profile }: RecipientDashboardProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default

  const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const bloodType = formData.get("bloodType") as string;
    const urgency = formData.get("urgency") as string;
    const units = parseInt(formData.get("units") as string);
    const locationName = formData.get("locationName") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const notes = formData.get("notes") as string;

    // Get user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Create request with expiry 24 hours from now
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);

          const { error } = await supabase.from("blood_requests").insert([{
            recipient_id: profile.id,
            blood_type_needed: bloodType as any,
            urgency: urgency as any,
            units_needed: units,
            latitude,
            longitude,
            location_name: locationName,
            contact_phone: contactPhone,
            notes,
            expires_at: expiresAt.toISOString(),
          }]);

          if (error) {
            toast({
              variant: "destructive",
              title: "Request failed",
              description: error.message,
            });
          } else {
            toast({
              title: "Request created!",
              description: "Nearby donors will be notified immediately.",
            });
            (e.target as HTMLFormElement).reset();
          }

          setLoading(false);
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enable location services to create a request.",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Donors */}
      <Card className="glass-card shadow-card border-2 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-accent" />
            Find Blood Donors
          </CardTitle>
          <CardDescription>
            Search for donors by blood type and distance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Blood Type Needed</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search Radius</Label>
              <Select value={searchRadius.toString()} onValueChange={(v) => setSearchRadius(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 meters</SelectItem>
                  <SelectItem value="100">100 meters</SelectItem>
                  <SelectItem value="500">500 meters</SelectItem>
                  <SelectItem value="1000">1 km</SelectItem>
                  <SelectItem value="2000">2 km</SelectItem>
                  <SelectItem value="3000">3 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full bg-accent hover:bg-accent/90">
            <Search className="mr-2 h-4 w-4" />
            Search Donors
          </Button>
        </CardContent>
      </Card>

      {/* Create Emergency Request */}
      <Card className="glass-card shadow-emergency border-2 border-emergency/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emergency">
            <AlertCircle className="h-5 w-5" />
            Create Emergency Request
          </CardTitle>
          <CardDescription>
            Send SOS alerts to all nearby eligible donors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type Needed</Label>
                <Select name="bloodType" required>
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select name="urgency" required defaultValue="high">
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Units Needed</Label>
              <Input
                id="units"
                name="units"
                type="number"
                min="1"
                defaultValue="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationName">Location Name</Label>
              <Input
                id="locationName"
                name="locationName"
                type="text"
                placeholder="e.g., City Hospital, Emergency Ward"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="+1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emergency hover:bg-emergency/90 shadow-emergency"
              disabled={loading}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              {loading ? "Creating Request..." : "Send Emergency Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipientDashboard;
