import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, TrendingUp, Award, Recycle, Truck, Factory } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Transaction } from "@shared/schema";

export default function Carbon() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const totalCredits =
    transactions?.reduce((sum, t) => sum + parseFloat(t.carbonCredits || "0"), 0) || 0;

  const creditBreakdown = [
    { name: "By-product Reuse", value: 45, color: "hsl(var(--chart-1))" },
    { name: "Efficient Logistics", value: 30, color: "hsl(var(--chart-2))" },
    { name: "Sustainable Practices", value: 25, color: "hsl(var(--chart-3))" },
  ];

  const impactMetrics = [
    {
      icon: Recycle,
      title: "Waste Reduction",
      value: "12.5 tons",
      description: "Total by-products reused",
      color: "text-green-600",
    },
    {
      icon: Truck,
      title: "Transport Optimization",
      value: "8,400 km",
      description: "Distance saved via route planning",
      color: "text-blue-600",
    },
    {
      icon: Factory,
      title: "Emission Reduction",
      value: "3.2 tons",
      description: "CO₂ equivalent prevented",
      color: "text-purple-600",
    },
  ];

  const milestones = [
    { threshold: 100, label: "Bronze Contributor", achieved: totalCredits >= 100 },
    { threshold: 500, label: "Silver Contributor", achieved: totalCredits >= 500 },
    { threshold: 1000, label: "Gold Contributor", achieved: totalCredits >= 1000 },
    { threshold: 5000, label: "Platinum Contributor", achieved: totalCredits >= 5000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Carbon Credits</h1>
        <p className="text-muted-foreground">
          Track your environmental impact and earn sustainability rewards
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-elevate transition-all duration-200" data-testid="card-total-credits">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Total Credits
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono text-green-600">
              {totalCredits.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Carbon offset units</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-this-month">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {(totalCredits * 0.15).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+24% from last month</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-rank">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Platform Rank
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">#12</div>
            <p className="text-xs text-muted-foreground mt-1">Top 5% of users</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Credit Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              ₹{(totalCredits * 125).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estimated market value</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Breakdown & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-breakdown">
          <CardHeader>
            <CardTitle>Credit Breakdown</CardTitle>
            <CardDescription>Sources of your carbon credits</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={creditBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {creditBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-testid="card-impact">
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Your contribution to sustainability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {impactMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-md border border-border hover-elevate"
                data-testid={`impact-${index}`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-md bg-muted ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{metric.title}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold font-mono">{metric.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card data-testid="card-milestones">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Sustainability Milestones
          </CardTitle>
          <CardDescription>
            Unlock achievements as you accumulate carbon credits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2" data-testid={`milestone-${index}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {milestone.achieved ? (
                    <Award className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <Award className="h-5 w-5 text-muted-foreground opacity-50" />
                  )}
                  <div>
                    <p className="font-medium">{milestone.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {milestone.threshold} credits
                    </p>
                  </div>
                </div>
                {milestone.achieved ? (
                  <Badge className="no-default-hover-elevate no-default-active-elevate">Achieved</Badge>
                ) : (
                  <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate">Locked</Badge>
                )}
              </div>
              <Progress
                value={Math.min((totalCredits / milestone.threshold) * 100, 100)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {milestone.achieved
                  ? "Unlocked!"
                  : `${(milestone.threshold - totalCredits).toFixed(1)} credits to go`}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Circular Economy */}
      <Card data-testid="card-circular-economy">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5" />
            Circular Economy Mapping
          </CardTitle>
          <CardDescription>
            How your by-products are being reused across industries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              byproduct: "Soymeal",
              uses: ["Animal Feed", "Fertilizer", "Biofuel"],
              percentage: 85,
            },
            {
              byproduct: "Sunflower Cake",
              uses: ["Cattle Feed", "Compost"],
              percentage: 72,
            },
            {
              byproduct: "Husk",
              uses: ["Biomass Energy", "Packaging Material"],
              percentage: 68,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-md border border-border hover-elevate"
              data-testid={`circular-${index}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{item.byproduct}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.uses.map((use, i) => (
                      <Badge key={i} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {item.percentage}% reused
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
