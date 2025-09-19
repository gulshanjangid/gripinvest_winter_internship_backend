import { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, Edit, Save, X, LogOut, TrendingUp, Target, Award, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  joinedDate: string;
  totalInvestments: number;
  portfolioValue: number;
  averageReturn: number;
  investmentGoals: string[];
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    riskAlerts: boolean;
  };
}

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  riskAppetite: string;
}

const mockProfile: UserProfile = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  riskAppetite: "Moderate",
  joinedDate: "2023-01-15",
  totalInvestments: 12,
  portfolioValue: 16500,
  averageReturn: 8.7,
  investmentGoals: [
    "Retirement planning",
    "Emergency fund",
    "Home purchase"
  ],
  preferences: {
    notifications: true,
    emailUpdates: true,
    riskAlerts: true
  }
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    riskAppetite: ""
  });
  const [saving, setSaving] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { actualTheme } = useTheme();

  // Mock API call
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfile(mockProfile);
        setEditForm({
          firstName: mockProfile.firstName,
          lastName: mockProfile.lastName,
          email: mockProfile.email,
          riskAppetite: mockProfile.riskAppetite
        });
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      riskAppetite: profile?.riskAppetite || ""
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile
      const updatedProfile = {
        ...profile,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        riskAppetite: editForm.riskAppetite as 'Conservative' | 'Moderate' | 'Aggressive'
      };
      
      setProfile(updatedProfile);
      setIsEditing(false);
      
      // Show success message (you could use a toast here)
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Mock logout
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Conservative": return "bg-success text-success-foreground";
      case "Moderate": return "bg-warning text-warning-foreground";
      case "Aggressive": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={isEditing ? editForm.firstName : profile.firstName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={isEditing ? editForm.lastName : profile.lastName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editForm.email : profile.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskAppetite">Risk Appetite</Label>
                <Select
                  value={isEditing ? editForm.riskAppetite : profile.riskAppetite}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, riskAppetite: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk appetite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conservative">Conservative (Low Risk)</SelectItem>
                    <SelectItem value="Moderate">Moderate (Medium Risk)</SelectItem>
                    <SelectItem value="Aggressive">Aggressive (High Risk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Joined:</span>
                    <span className="text-sm font-medium">{formatDate(profile.joinedDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Risk Level:</span>
                    <Badge className={getRiskColor(profile.riskAppetite)}>
                      {profile.riskAppetite}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Goals */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Investment Goals
              </CardTitle>
              <CardDescription>Your current investment objectives and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.investmentGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">{goal}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Goals
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive real-time updates</div>
                </div>
                <Badge variant={profile.preferences.notifications ? "default" : "secondary"}>
                  {profile.preferences.notifications ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Updates</div>
                  <div className="text-sm text-muted-foreground">Weekly portfolio summaries</div>
                </div>
                <Badge variant={profile.preferences.emailUpdates ? "default" : "secondary"}>
                  {profile.preferences.emailUpdates ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Risk Alerts</div>
                  <div className="text-sm text-muted-foreground">Market volatility notifications</div>
                </div>
                <Badge variant={profile.preferences.riskAlerts ? "default" : "secondary"}>
                  {profile.preferences.riskAlerts ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Portfolio Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  ₹{profile.portfolioValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {profile.totalInvestments}
                  </div>
                  <div className="text-xs text-muted-foreground">Investments</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-success">
                    {profile.averageReturn}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Return</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized investment suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-accent-light border border-accent/20">
                <h4 className="font-medium text-accent mb-2">Portfolio Diversification</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Consider adding international funds to diversify your portfolio and reduce risk.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Options
                </Button>
              </div>
              
              <div className="p-3 rounded-lg bg-success-light border border-success/20">
                <h4 className="font-medium text-success mb-2">Rebalancing Opportunity</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Your portfolio has drifted from target allocation. Rebalancing could improve returns.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Rebalance Now
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-warning-light border border-warning/20">
                <h4 className="font-medium text-warning mb-2">Risk Assessment</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Your current risk level matches your profile. Consider if you want to adjust.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Adjust Risk
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-6">
              <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to logout? You'll need to sign in again to access your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
