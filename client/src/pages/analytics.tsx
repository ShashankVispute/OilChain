import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Brain } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { PricePrediction } from "@shared/schema";

export default function Analytics() {
  const { data: predictions, isLoading } = useQuery<PricePrediction[]>({
    queryKey: ["/api/price-predictions"],
  });

  const priceChartData = predictions?.slice(0, 14).map((p) => ({
    date: new Date(p.predictionDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    current: parseFloat(p.currentPrice),
    predicted: parseFloat(p.predictedPrice),
    confidence: parseFloat(p.confidence),
  })) || [];

  const marketFactorsData = [
    { factor: "Demand", value: 85 },
    { factor: "Supply", value: 65 },
    { factor: "Seasonality", value: 75 },
    { factor: "Quality", value: 90 },
    { factor: "Export", value: 70 },
  ];

  const byproductPerformance = [
    { type: "Soymeal", avgPrice: 28.5, volume: 45000, trend: "up" },
    { type: "Sunflower Cake", avgPrice: 22.3, volume: 32000, trend: "up" },
    { type: "Cottonseed Cake", avgPrice: 19.8, volume: 28000, trend: "down" },
    { type: "Mustard Cake", avgPrice: 24.2, volume: 18000, trend: "up" },
    { type: "Groundnut Cake", avgPrice: 31.5, volume: 25000, trend: "up" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">AI Analytics</h1>
        <p className="text-muted-foreground">
          Machine learning insights and predictive analytics for market trends
        </p>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate transition-all duration-200" data-testid="card-insight-volatility">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Market Volatility
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono text-yellow-600">Medium</div>
            <p className="text-xs text-muted-foreground mt-1">
              AI confidence: 87%
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-insight-trend">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Price Trend
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono text-green-600">+5.2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next 7 days forecast
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-insight-ai">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              AI Prediction Accuracy
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">92.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Price Prediction Chart */}
      <Card data-testid="card-price-prediction">
        <CardHeader>
          <CardTitle>14-Day Price Forecast</CardTitle>
          <CardDescription>
            AI-powered predictions with confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : priceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={priceChartData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Current Price"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Predicted Price"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              No prediction data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Factors & By-product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-market-factors">
          <CardHeader>
            <CardTitle>Market Influence Factors</CardTitle>
            <CardDescription>
              AI analysis of key market drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={marketFactorsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={11} />
                <Radar
                  name="Impact Score"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-testid="card-byproduct-performance">
          <CardHeader>
            <CardTitle>By-product Performance</CardTitle>
            <CardDescription>
              Average prices and trading volumes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {byproductPerformance.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md border border-border hover-elevate"
                data-testid={`byproduct-${index}`}
              >
                <div className="flex items-center gap-3">
                  {item.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Vol: {item.volume.toLocaleString()} kg
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold font-mono">₹{item.avgPrice}</p>
                  <Badge
                    variant={item.trend === "up" ? "default" : "secondary"}
                    className="mt-1 no-default-hover-elevate no-default-active-elevate"
                  >
                    {item.trend === "up" ? "Rising" : "Falling"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card data-testid="card-recommendations">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized insights based on your trading patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "Optimal Selling Window",
              description:
                "Soymeal prices predicted to peak in 3-5 days. Consider listing your inventory now.",
              type: "opportunity",
            },
            {
              title: "Market Demand Surge",
              description:
                "Increased export demand for sunflower cake detected. Export opportunities available.",
              type: "opportunity",
            },
            {
              title: "Price Volatility Alert",
              description:
                "Cottonseed cake showing unusual price fluctuations. Monitor closely before trading.",
              type: "warning",
            },
          ].map((rec, index) => (
            <div
              key={index}
              className="p-4 rounded-md border border-border hover-elevate"
              data-testid={`recommendation-${index}`}
            >
              <div className="flex items-start gap-3">
                <Badge
                  variant={rec.type === "opportunity" ? "default" : "secondary"}
                  className="mt-0.5 no-default-hover-elevate no-default-active-elevate"
                >
                  {rec.type}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium mb-1">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
