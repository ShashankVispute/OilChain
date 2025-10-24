import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Palette } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and platform settings
        </p>
      </div>

      {/* Profile Settings */}
      <Card data-testid="card-profile">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                defaultValue="Farmer Name"
                data-testid="input-full-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                defaultValue="farmer@example.com"
                data-testid="input-email"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                defaultValue="+91 98765 43210"
                data-testid="input-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                defaultValue="Mumbai, Maharashtra"
                data-testid="input-location"
              />
            </div>
          </div>
          <Separator />
          <Button data-testid="button-save-profile">Save Profile</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card data-testid="card-notifications">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive alerts and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Price Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when prices reach your target levels
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-price-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Listings</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts for new products matching your interests
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-new-listings" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Transaction Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about changes to your transactions
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-transaction-updates" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IoT Device Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about device status and readings
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-iot-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export Opportunities</Label>
              <p className="text-sm text-muted-foreground">
                Get alerts for new international trade opportunities
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-export-alerts" />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card data-testid="card-security">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              data-testid="input-current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              data-testid="input-new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              data-testid="input-confirm-password"
            />
          </div>
          <Separator />
          <Button data-testid="button-change-password">Change Password</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card data-testid="card-appearance">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the platform looks to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for reduced eye strain
              </p>
            </div>
            <Switch data-testid="switch-dark-mode" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
