import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Package,
  FileText,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import type { Product, Transaction, PricePrediction, IotDevice } from "@shared/schema";

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery<PricePrediction[]>({
    queryKey: ["/api/price-predictions"],
  });

  const { data: iotDevices, isLoading: iotLoading } = useQuery<IotDevice[]>({
    queryKey: ["/api/iot-devices"],
  });

  const activeListings = products?.filter(p => p.status === "active").length || 0;
  const totalEarnings = transactions
    ?.filter(t => t.status === "completed")
    .reduce((sum, t) => sum + parseFloat(t.totalPrice || "0"), 0) || 0;
  const pendingTransactions = transactions?.filter(t => t.status === "pending").length || 0;
  const carbonCredits = transactions
    ?.reduce((sum, t) => sum + parseFloat(t.carbonCredits || "0"), 0) || 0;

  const chartData = predictions?.slice(0, 7).map(p => ({
    date: new Date(p.predictionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: parseFloat(p.predictedPrice),
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your agricultural trading activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate transition-all duration-200" data-testid="card-stat-listings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Active Listings
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-semibold font-mono" data-testid="text-active-listings">
                {activeListings}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-stat-earnings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Total Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <div className="text-3xl font-semibold font-mono" data-testid="text-total-earnings">
                ₹{totalEarnings.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+18%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-stat-transactions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Pending Deals
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-semibold font-mono" data-testid="text-pending-transactions">
                {pendingTransactions}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-red-600" />
              <span className="text-red-600">-5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-stat-carbon">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Carbon Credits
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-semibold font-mono" data-testid="text-carbon-credits">
                {carbonCredits.toFixed(1)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+24%</span> this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Forecast Chart */}
        <Card data-testid="card-price-forecast">
          <CardHeader>
            <CardTitle>AI Price Forecast</CardTitle>
            <p className="text-sm text-muted-foreground">
              Predicted prices for the next 7 days
            </p>
          </CardHeader>
          <CardContent>
            {predictionsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No prediction data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* IoT Devices Status */}
        <Card data-testid="card-iot-status">
          <CardHeader>
            <CardTitle>IoT Device Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of connected sensors
            </p>
          </CardHeader>
          <CardContent>
            {iotLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : iotDevices && iotDevices.length > 0 ? (
              <div className="space-y-3">
                {iotDevices.slice(0, 4).map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 rounded-md border border-border hover-elevate"
                    data-testid={`device-${device.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse-subtle ${
                          device.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{device.deviceName}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold">
                        {device.lastReading
                          ? `${(device.lastReading as any).value}${(device.lastReading as any).unit}`
                          : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {device.batteryLevel}% battery
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No IoT devices connected
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card data-testid="card-recent-transactions">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest trading activities
          </p>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border hover-elevate"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div>
                    <p className="font-medium text-sm">
                      Transaction #{transaction.id.substring(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-mono">
                      ₹{parseFloat(transaction.totalPrice).toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === "completed"
                        ? "text-green-600"
                        : transaction.status === "pending"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No transactions yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
