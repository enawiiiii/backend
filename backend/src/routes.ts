import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all dresses
  app.get("/api/dresses", async (req, res) => {
    try {
      const dresses = await storage.getAllDresses();
      res.json(dresses);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
  });

  // Search dresses
  app.get("/api/dresses/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "استعلام البحث مطلوب" });
      }
      
      const dresses = await storage.searchDresses(q);
      res.json(dresses);
    } catch (error) {
      res.status(500).json({ message: "خطأ في البحث" });
    }
  });

  // Get single dress
  app.get("/api/dresses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dress = await storage.getDress(id);
      
      if (!dress) {
        return res.status(404).json({ message: "الفستان غير موجود" });
      }
      
      res.json(dress);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
  });

  // Create new dress
  app.post("/api/dresses", async (req, res) => {
    try {
      const validatedData = insertDressSchema.parse(req.body);
      
      // Check if model number already exists
      const existingDress = await storage.getDressByModelNumber(validatedData.modelNumber);
      if (existingDress) {
        return res.status(400).json({ message: "رقم الموديل موجود بالفعل" });
      }
      
      const dress = await storage.createDress(validatedData);
      res.status(201).json(dress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "بيانات غير صحيحة",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "خطأ في حفظ البيانات" });
    }
  });

  // Update dress
  app.put("/api/dresses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertDressSchema.partial().parse(req.body);
      
      // If updating model number, check it doesn't exist for other dresses
      if (validatedData.modelNumber) {
        const existingDress = await storage.getDressByModelNumber(validatedData.modelNumber);
        if (existingDress && existingDress.id !== id) {
          return res.status(400).json({ message: "رقم الموديل موجود بالفعل" });
        }
      }
      
      const updatedDress = await storage.updateDress(id, validatedData);
      if (!updatedDress) {
        return res.status(404).json({ message: "الفستان غير موجود" });
      }
      
      res.json(updatedDress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "بيانات غير صحيحة",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "خطأ في تحديث البيانات" });
    }
  });

  // Delete dress
  app.delete("/api/dresses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDress(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "الفستان غير موجود" });
      }
      
      res.json({ message: "تم حذف الفستان بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف الفستان" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
