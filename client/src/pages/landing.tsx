import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  Globe,
  Cpu,
  Leaf,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import heroImage from "@assets/generated_images/Farmer_using_mobile_technology_in_field_c2d1665d.png";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-semibold text-xl">OILCHAIN360</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button asChild variant="ghost" data-testid="button-login">
                <Link href="/dashboard">Login</Link>
              </Button>
              <Button asChild data-testid="button-get-started">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6">
              Revolutionize Oilseed By-Product Trading
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              AI-powered marketplace connecting farmers, processors, and buyers with blockchain-inspired smart contracts, predictive analytics, and global export matchmaking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white/90 hover:bg-white text-foreground backdrop-blur-sm border border-border" data-testid="button-hero-start">
                <Link href="/dashboard">
                  Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" data-testid="button-hero-learn">
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Powerful Features for the Entire Value Chain
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empower farmers to monetize every part of the oilseed value chain with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Smart Contract Security",
                description: "Blockchain-inspired transactions with automatic payment verification and dispute resolution",
              },
              {
                icon: TrendingUp,
                title: "AI Price Predictions",
                description: "Machine learning models forecast market volatility and predict optimal selling prices",
              },
              {
                icon: Globe,
                title: "Export Matchmaking",
                description: "Intelligent algorithms connect sellers with global buyers based on quality and requirements",
              },
              {
                icon: Cpu,
                title: "IoT Integration",
                description: "Real-time quality monitoring with moisture sensors, weight scales, and temperature tracking",
              },
              {
                icon: Leaf,
                title: "Carbon Credit Tracking",
                description: "Calculate environmental impact and earn credits for sustainable practices",
              },
              {
                icon: BarChart3,
                title: "Market Analytics",
                description: "Comprehensive insights on supply-demand trends, seasonal patterns, and price corridors",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* By-Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Trade Premium Oilseed By-Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Soymeal, sunflower cake, cottonseed cake, husk, and more
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Soymeal", "Sunflower Cake", "Cottonseed Cake", "Mustard Cake", "Groundnut Cake", "Sesame Cake", "Rice Bran", "Husk & Fiber"].map((product, index) => (
              <Card key={index} className="text-center p-6 hover-elevate transition-all duration-200" data-testid={`card-byproduct-${index}`}>
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">{product}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of farmers, processors, and exporters already using OILCHAIN360
          </p>
          <Button asChild size="lg" variant="secondary" data-testid="button-cta-start">
            <Link href="/dashboard">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="font-semibold text-lg">OILCHAIN360</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart marketplace for oilseed by-products powered by AI and blockchain technology
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                <li><Link href="/analytics" className="hover:text-foreground transition-colors">Analytics</Link></li>
                <li><Link href="/export" className="hover:text-foreground transition-colors">Export</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 OILCHAIN360. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
