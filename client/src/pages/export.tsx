import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, TrendingUp, MapPin, Target, ArrowRight, Star } from "lucide-react";
import type { ExportOpportunity } from "@shared/schema";

export default function Export() {
  const { data: opportunities, isLoading } = useQuery<ExportOpportunity[]>({
    queryKey: ["/api/export-opportunities"],
  });

  const getDemandColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Export Opportunities</h1>
        <p className="text-muted-foreground">
          AI-powered matchmaking for global export markets
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-elevate transition-all duration-200" data-testid="card-total-opportunities">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Opportunities
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {opportunities?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-high-demand">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              High Demand
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono text-green-600">
              {opportunities?.filter((o) => o.demandLevel === "high").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-countries">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Countries
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {new Set(opportunities?.map((o) => o.targetCountry)).size || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200" data-testid="card-avg-match">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wide">
              Avg Match Score
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {opportunities && opportunities.length > 0
                ? Math.round(
                    opportunities.reduce((sum, o) => sum + o.matchScore, 0) /
                      opportunities.length
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities Grid */}
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
      ) : opportunities && opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <Card
              key={opportunity.id}
              className="hover-elevate transition-all duration-200 flex flex-col"
              data-testid={`card-opportunity-${opportunity.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{opportunity.targetCountry}</CardTitle>
                  </div>
                  <Badge className={`${getDemandColor(opportunity.demandLevel)} shrink-0 no-default-hover-elevate no-default-active-elevate`}>
                    {opportunity.demandLevel}
                  </Badge>
                </div>
                <CardDescription>
                  {opportunity.byproductType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-md bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Match Score</p>
                    <div className="flex items-center gap-2">
                      <Star className={`h-5 w-5 ${getMatchScoreColor(opportunity.matchScore)}`} />
                      <span className={`text-2xl font-semibold font-mono ${getMatchScoreColor(opportunity.matchScore)}`}>
                        {opportunity.matchScore}%
                      </span>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>

                <div className="space-y-3">
                  {opportunity.priceRange && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                      <p className="font-semibold font-mono">{opportunity.priceRange}</p>
                    </div>
                  )}
                  {opportunity.minimumQuantity && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Minimum Quantity</p>
                      <p className="font-semibold font-mono">
                        {opportunity.minimumQuantity.toLocaleString()} kg
                      </p>
                    </div>
                  )}
                  {opportunity.requirements && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(opportunity.requirements as Record<string, string>).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full" data-testid={`button-contact-${opportunity.id}`}>
                  Contact Buyer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No export opportunities found</p>
            <p className="text-sm">
              AI-powered matchmaking will identify suitable international buyers for your products
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
