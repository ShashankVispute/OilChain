import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Activity, Battery, Signal, Plus, Droplets, Weight, Thermometer } from "lucide-react";
import type { IotDevice } from "@shared/schema";

export default function IoTDevices() {
  const { data: devices, isLoading } = useQuery<IotDevice[]>({
    queryKey: ["/api/iot-devices"],
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "moisture_sensor":
        return Droplets;
      case "weight_scale":
        return Weight;
      case "temperature_sensor":
        return Thermometer;
      default:
        return Cpu;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-400";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600";
    if (level > 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">IoT Devices</h1>
          <p className="text-muted-foreground">
            Monitor and manage your connected sensors and equipment
          </p>
        </div>
        <Button data-testid="button-add-device">
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-elevate transition-all duration-200" data-testid="card-total-devices">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Total Devices
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {devices?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-active-devices">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Active
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono text-green-600">
              {devices?.filter((d) => d.status === "active").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-avg-battery">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Avg Battery
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {devices && devices.length > 0
                ? Math.round(
                    devices.reduce((sum, d) => sum + (d.batteryLevel || 0), 0) /
                      devices.length
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-connectivity">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Connectivity
            </CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono text-green-600">
              98.5%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : devices && devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.deviceType);
            return (
              <Card
                key={device.id}
                className="hover-elevate transition-all duration-200"
                data-testid={`card-device-${device.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                        <DeviceIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.deviceName}</CardTitle>
                        <CardDescription className="text-sm">
                          {device.location}
                        </CardDescription>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse-subtle ${getStatusColor(
                        device.status
                      )}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {device.lastReading && (
                    <div className="p-4 rounded-md bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Last Reading</p>
                      <p className="text-2xl font-semibold font-mono">
                        {(device.lastReading as any).value}
                        {(device.lastReading as any).unit}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date((device.lastReading as any).timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Battery</p>
                      <div className="flex items-center gap-2">
                        <Battery
                          className={`h-4 w-4 ${getBatteryColor(
                            device.batteryLevel || 0
                          )}`}
                        />
                        <span className="font-semibold font-mono">
                          {device.batteryLevel}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate">
                        {device.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${device.id}`}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-settings-${device.id}`}>
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No IoT devices connected</p>
            <p className="text-sm mb-4">
              Connect your sensors to monitor quality and inventory in real-time
            </p>
            <Button data-testid="button-add-first">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Device
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
