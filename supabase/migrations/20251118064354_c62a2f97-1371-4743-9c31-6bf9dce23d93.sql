-- Create enum types for blood types and user roles
CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE user_role AS ENUM ('donor', 'recipient', 'hospital', 'admin');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE donation_status AS ENUM ('available', 'unavailable', 'busy', 'emergency_mode');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  blood_type blood_type NOT NULL,
  role user_role NOT NULL DEFAULT 'donor',
  date_of_birth DATE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health_profiles table for detailed health information
CREATE TABLE public.health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  has_diabetes BOOLEAN DEFAULT FALSE,
  has_hypertension BOOLEAN DEFAULT FALSE,
  recent_surgeries BOOLEAN DEFAULT FALSE,
  surgery_date DATE,
  current_medications TEXT[],
  has_infections BOOLEAN DEFAULT FALSE,
  infection_details TEXT,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  last_donation_date DATE,
  donation_frequency INTEGER DEFAULT 0,
  eligibility_score INTEGER DEFAULT 100 CHECK (eligibility_score >= 0 AND eligibility_score <= 100),
  is_eligible BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create donor_locations table for real-time tracking
CREATE TABLE public.donor_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status donation_status DEFAULT 'available',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(donor_id)
);

-- Create blood_requests table for recipient requests
CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_type_needed blood_type NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'medium',
  units_needed INTEGER NOT NULL DEFAULT 1,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name TEXT,
  contact_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sos_alerts table for emergency notifications
CREATE TABLE public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  distance_meters DECIMAL(10, 2),
  notified_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  response TEXT,
  status TEXT DEFAULT 'pending'
);

-- Create donation_history table
CREATE TABLE public.donation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  donation_date DATE NOT NULL,
  units_donated INTEGER DEFAULT 1,
  hospital_name TEXT,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gamification table for donor rewards
CREATE TABLE public.donor_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_donations INTEGER DEFAULT 0,
  lives_saved INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[],
  streak_days INTEGER DEFAULT 0,
  last_donation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for health_profiles
CREATE POLICY "Users can view own health profile" ON public.health_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own health profile" ON public.health_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health profile" ON public.health_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for donor_locations (visible to all for searching)
CREATE POLICY "Anyone can view visible donor locations" ON public.donor_locations FOR SELECT USING (is_visible = true);
CREATE POLICY "Donors can update own location" ON public.donor_locations FOR UPDATE USING (auth.uid() = donor_id);
CREATE POLICY "Donors can insert own location" ON public.donor_locations FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- RLS Policies for blood_requests
CREATE POLICY "Anyone can view active requests" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Recipients can create requests" ON public.blood_requests FOR INSERT WITH CHECK (auth.uid() = recipient_id);
CREATE POLICY "Recipients can update own requests" ON public.blood_requests FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for sos_alerts
CREATE POLICY "Users can view their alerts" ON public.sos_alerts FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "System can insert alerts" ON public.sos_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Donors can update their alerts" ON public.sos_alerts FOR UPDATE USING (auth.uid() = donor_id);

-- RLS Policies for donation_history
CREATE POLICY "Users can view own donation history" ON public.donation_history FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Users can insert donation history" ON public.donation_history FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- RLS Policies for donor_stats
CREATE POLICY "Anyone can view donor stats" ON public.donor_stats FOR SELECT USING (true);
CREATE POLICY "Donors can update own stats" ON public.donor_stats FOR UPDATE USING (auth.uid() = donor_id);
CREATE POLICY "Donors can insert own stats" ON public.donor_stats FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON public.health_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donor_locations_updated_at BEFORE UPDATE ON public.donor_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON public.blood_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donor_stats_updated_at BEFORE UPDATE ON public.donor_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;

-- Create indexes for performance
CREATE INDEX idx_donor_locations_donor_id ON public.donor_locations(donor_id);
CREATE INDEX idx_donor_locations_status ON public.donor_locations(status);
CREATE INDEX idx_donor_locations_coords ON public.donor_locations(latitude, longitude);
CREATE INDEX idx_blood_requests_blood_type ON public.blood_requests(blood_type_needed);
CREATE INDEX idx_blood_requests_status ON public.blood_requests(status);
CREATE INDEX idx_blood_requests_urgency ON public.blood_requests(urgency);
CREATE INDEX idx_profiles_blood_type ON public.profiles(blood_type);
CREATE INDEX idx_profiles_role ON public.profiles(role);