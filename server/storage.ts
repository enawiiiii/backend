import { type User, type InsertUser, type Dress, type InsertDress, type ColorAndSize } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dress operations
  getAllDresses(): Promise<Dress[]>;
  getDress(id: string): Promise<Dress | undefined>;
  getDressByModelNumber(modelNumber: string): Promise<Dress | undefined>;
  createDress(dress: InsertDress): Promise<Dress>;
  updateDress(id: string, dress: Partial<InsertDress>): Promise<Dress | undefined>;
  deleteDress(id: string): Promise<boolean>;
  searchDresses(query: string): Promise<Dress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private dresses: Map<string, Dress>;

  constructor() {
    this.users = new Map();
    this.dresses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDresses(): Promise<Dress[]> {
    return Array.from(this.dresses.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getDress(id: string): Promise<Dress | undefined> {
    return this.dresses.get(id);
  }

  async getDressByModelNumber(modelNumber: string): Promise<Dress | undefined> {
    return Array.from(this.dresses.values()).find(
      (dress) => dress.modelNumber === modelNumber,
    );
  }

  async createDress(insertDress: InsertDress): Promise<Dress> {
    const id = randomUUID();
    const now = new Date();
    const dress: Dress = { 
      ...insertDress, 
      id, 
      createdAt: now, 
      updatedAt: now,
      colorsAndSizes: insertDress.colorsAndSizes || []
    };
    this.dresses.set(id, dress);
    return dress;
  }

  async updateDress(id: string, updateData: Partial<InsertDress>): Promise<Dress | undefined> {
    const existingDress = this.dresses.get(id);
    if (!existingDress) return undefined;

    const updatedDress: Dress = {
      ...existingDress,
      ...updateData,
      id,
      updatedAt: new Date(),
    };
    
    this.dresses.set(id, updatedDress);
    return updatedDress;
  }

  async deleteDress(id: string): Promise<boolean> {
    return this.dresses.delete(id);
  }

  async searchDresses(query: string): Promise<Dress[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.dresses.values()).filter(dress =>
      dress.modelNumber.toLowerCase().includes(lowercaseQuery) ||
      dress.companyName.toLowerCase().includes(lowercaseQuery) ||
      dress.pieceType.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const storage = new MemStorage();
