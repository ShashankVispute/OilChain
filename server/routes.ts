import type { Express } from "express";
import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  products,
  transactions,
  iotDevices,
  pricePredictions,
  exportOpportunities,
  insertProductSchema,
  insertTransactionSchema,
  insertIotDeviceSchema,
  insertPricePredictionSchema,
  insertExportOpportunitySchema,
  type Product,
  type Transaction,
  type IotDevice,
  type PricePrediction,
  type ExportOpportunity,
} from "@shared/schema";
import { generatePricePredictions, analyzeQualityMetrics, matchExportOpportunities } from "./ai-service";
import { calculateCarbonCredits } from "./carbon-service";

export function registerRoutes(app: Express) {
  // ============= PRODUCTS ENDPOINTS =============

  // Get all active products (marketplace)
  app.get("/api/products", async (_req, res) => {
    try {
      const allProducts = await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
        with: {
          seller: {
            columns: {
              id: true,
              username: true,
              fullName: true,
              location: true,
            },
          },
        },
      });
      res.json(allProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get current user's products (mock user for now)
  app.get("/api/my-products", async (_req, res) => {
    try {
      // In a real app, this would use req.user.id from authentication
      const myProducts = await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
        limit: 50,
      });
      res.json(myProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new product listing
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Use AI to validate and enhance quality metrics
      const enhancedMetrics = await analyzeQualityMetrics(
        validatedData.byproductType,
        validatedData.qualityMetrics as Record<string, number>
      );

      const [newProduct] = await db
        .insert(products)
        .values({
          ...validatedData,
          qualityMetrics: enhancedMetrics,
          status: "active",
        })
        .returning();

      // Generate price predictions for this product type
      await generatePricePredictions(validatedData.byproductType);

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update product
  app.patch("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const [updatedProduct] = await db
        .update(products)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [deleted] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= TRANSACTIONS ENDPOINTS =============

  // Get all transactions
  app.get("/api/transactions", async (_req, res) => {
    try {
      const allTransactions = await db.query.transactions.findMany({
        orderBy: [desc(transactions.createdAt)],
        with: {
          product: true,
          buyer: {
            columns: {
              id: true,
              username: true,
              fullName: true,
            },
          },
          seller: {
            columns: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });
      res.json(allTransactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new transaction (initiate smart contract)
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);

      // Calculate carbon credits for this transaction
      const carbonCredits = calculateCarbonCredits(
        validatedData.quantity,
        req.body.byproductType
      );

      // Generate smart contract hash (blockchain-inspired)
      const contractHash = `0x${Buffer.from(
        `${validatedData.productId}-${Date.now()}-${Math.random()}`
      )
        .toString("base64")
        .substring(0, 64)}`;

      const [newTransaction] = await db
        .insert(transactions)
        .values({
          ...validatedData,
          smartContractHash: contractHash,
          carbonCredits: carbonCredits.toString(),
          status: "pending",
        })
        .returning();

      res.status(201).json(newTransaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update transaction status
  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updates: any = { status };
      if (status === "completed") {
        updates.completedAt = new Date();
      }

      const [updated] = await db
        .update(transactions)
        .set(updates)
        .where(eq(transactions.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= IOT DEVICES ENDPOINTS =============

  // Get all IoT devices
  app.get("/api/iot-devices", async (_req, res) => {
    try {
      const devices = await db.query.iotDevices.findMany({
        orderBy: [desc(iotDevices.createdAt)],
      });
      res.json(devices);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new IoT device
  app.post("/api/iot-devices", async (req, res) => {
    try {
      const validatedData = insertIotDeviceSchema.parse(req.body);

      const [newDevice] = await db
        .insert(iotDevices)
        .values({
          ...validatedData,
          status: "active",
          batteryLevel: 100,
        })
        .returning();

      res.status(201).json(newDevice);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update IoT device reading
  app.patch("/api/iot-devices/:id/reading", async (req, res) => {
    try {
      const { id } = req.params;
      const { value, unit } = req.body;

      const [updated] = await db
        .update(iotDevices)
        .set({
          lastReading: {
            value,
            unit,
            timestamp: new Date().toISOString(),
          },
          updatedAt: new Date(),
        })
        .where(eq(iotDevices.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Device not found" });
      }

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= PRICE PREDICTIONS ENDPOINTS =============

  // Get price predictions
  app.get("/api/price-predictions", async (req, res) => {
    try {
      const { byproductType } = req.query;

      const query = byproductType
        ? db.query.pricePredictions.findMany({
            where: eq(pricePredictions.byproductType, byproductType as string),
            orderBy: [desc(pricePredictions.predictionDate)],
            limit: 30,
          })
        : db.query.pricePredictions.findMany({
            orderBy: [desc(pricePredictions.predictionDate)],
            limit: 50,
          });

      const predictions = await query;
      res.json(predictions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate new price predictions (AI-powered)
  app.post("/api/price-predictions/generate", async (req, res) => {
    try {
      const { byproductType } = req.body;
      
      const newPredictions = await generatePricePredictions(byproductType);
      res.status(201).json(newPredictions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= EXPORT OPPORTUNITIES ENDPOINTS =============

  // Get export opportunities
  app.get("/api/export-opportunities", async (req, res) => {
    try {
      const { byproductType } = req.query;

      const query = byproductType
        ? db.query.exportOpportunities.findMany({
            where: eq(exportOpportunities.byproductType, byproductType as string),
            orderBy: [desc(exportOpportunities.matchScore)],
          })
        : db.query.exportOpportunities.findMany({
            orderBy: [desc(exportOpportunities.matchScore)],
            limit: 20,
          });

      const opportunities = await query;
      res.json(opportunities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate export matchmaking opportunities (AI-powered)
  app.post("/api/export-opportunities/generate", async (req, res) => {
    try {
      const { productId } = req.body;

      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const opportunities = await matchExportOpportunities(product);
      res.status(201).json(opportunities);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= SEED DATA ENDPOINT (FOR DEMO) =============

  app.post("/api/seed-demo-data", async (_req, res) => {
    try {
      // Create demo user if not exists
      let demoUser = await db.query.users.findFirst({
        where: eq(users.username, "demo-farmer"),
      });

      if (!demoUser) {
        [demoUser] = await db
          .insert(users)
          .values({
            username: "demo-farmer",
            email: "demo@oilchain360.com",
            password: "hashed_password_here",
            fullName: "Demo Farmer",
            role: "farmer",
            location: "Punjab, India",
            phone: "+91 98765 43210",
          })
          .returning();
      }

      // Create demo products
      const demoProducts = [
        {
          sellerId: demoUser.id,
          title: "Premium Quality Soymeal - High Protein Content",
          byproductType: "soymeal",
          quantity: 5000,
          pricePerKg: "28.50",
          qualityGrade: "A+",
          qualityMetrics: { moisture: 10, protein: 48, purity: 99 },
          location: "Ludhiana, Punjab",
          description: "Freshly processed soymeal with excellent protein content, suitable for animal feed and export.",
          certifications: ["ISO 9001", "FSSAI"],
          availableForExport: true,
          status: "active",
        },
        {
          sellerId: demoUser.id,
          title: "Sunflower Cake - Organic",
          byproductType: "sunflower_cake",
          quantity: 3200,
          pricePerKg: "22.00",
          qualityGrade: "A",
          qualityMetrics: { moisture: 12, protein: 38, purity: 96 },
          location: "Jaipur, Rajasthan",
          description: "Organically certified sunflower cake, ideal for cattle feed.",
          certifications: ["Organic India"],
          availableForExport: true,
          status: "active",
        },
        {
          sellerId: demoUser.id,
          title: "Cottonseed Cake - Bulk Available",
          byproductType: "cottonseed_cake",
          quantity: 8000,
          pricePerKg: "19.75",
          qualityGrade: "B",
          qualityMetrics: { moisture: 14, protein: 35, purity: 94 },
          location: "Ahmedabad, Gujarat",
          description: "Large quantity cottonseed cake available for immediate delivery.",
          certifications: [],
          availableForExport: false,
          status: "active",
        },
      ];

      const createdProducts = await db.insert(products).values(demoProducts).returning();

      // Create demo IoT devices
      const demoDevices = [
        {
          userId: demoUser.id,
          deviceName: "Warehouse Moisture Sensor #1",
          deviceType: "moisture_sensor",
          location: "Main Warehouse, Punjab",
          status: "active",
          lastReading: { value: 11.2, unit: "%", timestamp: new Date().toISOString() },
          batteryLevel: 87,
        },
        {
          userId: demoUser.id,
          deviceName: "Storage Weight Scale #2",
          deviceType: "weight_scale",
          location: "Storage Unit B",
          status: "active",
          lastReading: { value: 4850, unit: "kg", timestamp: new Date().toISOString() },
          batteryLevel: 92,
        },
        {
          userId: demoUser.id,
          deviceName: "Temperature Monitor #3",
          deviceType: "temperature_sensor",
          location: "Cold Storage",
          status: "active",
          lastReading: { value: 18.5, unit: "°C", timestamp: new Date().toISOString() },
          batteryLevel: 78,
        },
      ];

      await db.insert(iotDevices).values(demoDevices).returning();

      // Generate price predictions for demo
      await generatePricePredictions("soymeal");
      await generatePricePredictions("sunflower_cake");

      // Create demo transactions
      const demoTransactions = [
        {
          productId: createdProducts[0].id,
          buyerId: demoUser.id,
          sellerId: demoUser.id,
          quantity: 1000,
          totalPrice: "28500.00",
          status: "completed",
          smartContractHash: `0x${Buffer.from(`demo-contract-1`).toString("base64")}`,
          deliveryTerms: "FOB",
          paymentTerms: "30 days",
          carbonCredits: "12.5",
          completedAt: new Date(),
        },
        {
          productId: createdProducts[1].id,
          buyerId: demoUser.id,
          sellerId: demoUser.id,
          quantity: 500,
          totalPrice: "11000.00",
          status: "pending",
          smartContractHash: `0x${Buffer.from(`demo-contract-2`).toString("base64")}`,
          deliveryTerms: "CIF",
          paymentTerms: "Advance payment",
          carbonCredits: "6.2",
        },
      ];

      await db.insert(transactions).values(demoTransactions).returning();

      // Create demo export opportunities
      const demoExportOpportunities = [
        {
          byproductType: "soymeal",
          targetCountry: "Bangladesh",
          demandLevel: "high",
          matchScore: 92,
          priceRange: "₹30-35 per kg",
          minimumQuantity: 2000,
          requirements: { protein: "min 45%", moisture: "max 12%" },
          contactInfo: "buyer@bangladesh-imports.com",
        },
        {
          byproductType: "sunflower_cake",
          targetCountry: "UAE",
          demandLevel: "high",
          matchScore: 88,
          priceRange: "₹25-28 per kg",
          minimumQuantity: 5000,
          requirements: { organic: "certified", purity: "min 95%" },
          contactInfo: "procurement@uae-feeds.ae",
        },
        {
          byproductType: "cottonseed_cake",
          targetCountry: "Vietnam",
          demandLevel: "medium",
          matchScore: 75,
          priceRange: "₹18-22 per kg",
          minimumQuantity: 3000,
          requirements: { protein: "min 30%" },
          contactInfo: "imports@vietnam-agri.vn",
        },
      ];

      await db.insert(exportOpportunities).values(demoExportOpportunities).returning();

      res.json({ success: true, message: "Demo data seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
