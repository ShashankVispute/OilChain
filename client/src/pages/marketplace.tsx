import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Star, TrendingUp, Package } from "lucide-react";
import type { Product } from "@shared/schema";

const byproductTypes = [
  "All Types",
  "soymeal",
  "sunflower_cake",
  "cottonseed_cake",
  "mustard_cake",
  "groundnut_cake",
  "husk",
];

const qualityGrades = ["All Grades", "A+", "A", "B", "C"];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All Types" || product.byproductType === selectedType;
    const matchesGrade =
      selectedGrade === "All Grades" || product.qualityGrade === selectedGrade;
    return matchesSearch && matchesType && matchesGrade && product.status === "active";
  });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "A":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "B":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Discover premium oilseed by-products from verified sellers
          </p>
        </div>
        <Button asChild data-testid="button-add-listing">
          <Link href="/my-listings">
            <Package className="h-4 w-4 mr-2" />
            My Listings
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card data-testid="card-filters">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger data-testid="select-type">
                <SelectValue placeholder="By-product Type" />
              </SelectTrigger>
              <SelectContent>
                {byproductTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger data-testid="select-grade">
                <SelectValue placeholder="Quality Grade" />
              </SelectTrigger>
              <SelectContent>
                {qualityGrades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover-elevate transition-all duration-200 flex flex-col"
              data-testid={`card-product-${product.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl line-clamp-2">{product.title}</CardTitle>
                  <Badge className={`${getGradeColor(product.qualityGrade)} shrink-0 no-default-hover-elevate no-default-active-elevate`}>
                    {product.qualityGrade}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">By-product Type</p>
                    <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate">
                      {product.byproductType.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                      <p className="font-semibold font-mono">
                        {product.quantity.toLocaleString()} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price/kg</p>
                      <p className="font-semibold font-mono text-primary">
                        ₹{parseFloat(product.pricePerKg).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {product.qualityMetrics && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Quality Metrics</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(product.qualityMetrics as Record<string, number>).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="text-muted-foreground capitalize">{key}:</span>{" "}
                            <span className="font-medium">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.availableForExport && (
                    <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Available for Export
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="flex-1" data-testid={`button-view-${product.id}`}>
                  <Star className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm">
              Try adjusting your filters or search criteria
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
