import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertForumPostSchema,
  insertForumCommentSchema,
  insertSecondOpinionRequestSchema,
  insertMessageSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/doctors", async (_req: Request, res: Response) => {
    try {
      const doctors = await storage.getDoctors();
      
      // Remove passwords
      const doctorsWithoutPasswords = doctors.map(doctor => {
        const { password, ...doctorWithoutPassword } = doctor;
        return doctorWithoutPassword;
      });
      
      return res.status(200).json(doctorsWithoutPasswords);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Forum routes
  app.get("/api/forum/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getForumCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/forum/posts", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let posts;
      if (categoryId) {
        posts = await storage.getForumPostsByCategory(categoryId);
      } else {
        posts = await storage.getForumPosts();
      }
      
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/forum/posts/:id", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Increment view count
      await storage.incrementPostViewCount(postId);
      
      const comments = await storage.getForumCommentsByPost(postId);
      
      return res.status(200).json({ post, comments });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/forum/posts", async (req: Request, res: Response) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/forum/comments", async (req: Request, res: Response) => {
    try {
      const commentData = insertForumCommentSchema.parse(req.body);
      const comment = await storage.createForumComment(commentData);
      return res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Second Opinion routes
  app.get("/api/second-opinion/requests", async (req: Request, res: Response) => {
    try {
      const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
      const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;
      
      let requests;
      if (patientId) {
        requests = await storage.getSecondOpinionRequestsByPatient(patientId);
      } else if (doctorId) {
        requests = await storage.getSecondOpinionRequestsByDoctor(doctorId);
      } else {
        requests = await storage.getSecondOpinionRequests();
      }
      
      return res.status(200).json(requests);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/second-opinion/requests", async (req: Request, res: Response) => {
    try {
      const requestData = insertSecondOpinionRequestSchema.parse(req.body);
      const request = await storage.createSecondOpinionRequest(requestData);
      return res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/second-opinion/requests/:id/status", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(requestId) || !status) {
        return res.status(400).json({ message: "Invalid request ID or status" });
      }
      
      const updatedRequest = await storage.updateSecondOpinionRequestStatus(requestId, status);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      return res.status(200).json(updatedRequest);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Messaging routes
  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const messages = await storage.getMessages(userId);
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/messages/conversation", async (req: Request, res: Response) => {
    try {
      const user1Id = req.query.user1Id ? parseInt(req.query.user1Id as string) : undefined;
      const user2Id = req.query.user2Id ? parseInt(req.query.user2Id as string) : undefined;
      
      if (!user1Id || !user2Id) {
        return res.status(400).json({ message: "Both user IDs required" });
      }
      
      const conversation = await storage.getConversation(user1Id, user2Id);
      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/messages/:id/read", async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.id);
      
      if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      await storage.markMessageAsRead(messageId);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Pharmacy routes
  app.get("/api/pharmacies", async (req: Request, res: Response) => {
    try {
      const region = req.query.region as string | undefined;
      const city = req.query.city as string | undefined;
      const specialization = req.query.specialization as string | undefined;
      
      let pharmacies;
      if (region) {
        pharmacies = await storage.getPharmaciesByRegion(region);
      } else if (city) {
        pharmacies = await storage.getPharmaciesByCity(city);
      } else if (specialization) {
        pharmacies = await storage.getPharmaciesBySpecialization(specialization);
      } else {
        pharmacies = await storage.getPharmacies();
      }
      
      return res.status(200).json(pharmacies);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Testimonial routes
  app.get("/api/testimonials", async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      return res.status(200).json(testimonials);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Config routes
  app.get("/api/config/google-maps", (_req: Request, res: Response) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
  });

  const httpServer = createServer(app);

  return httpServer;
}
