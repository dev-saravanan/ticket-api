const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// File path for storing tickets
const ticketsFile = path.join(__dirname, "tickets.json");

// Initialize tickets file if it doesn't exist
const initializeTicketsFile = () => {
  if (!fs.existsSync(ticketsFile)) {
    fs.writeFileSync(ticketsFile, JSON.stringify([]));
  }
};

// Read all tickets from file
const readTickets = () => {
  try {
    const data = fs.readFileSync(ticketsFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tickets:", error);
    return [];
  }
};

// Write tickets to file
const writeTickets = (tickets) => {
  try {
    fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error("Error writing tickets:", error);
  }
};

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ticket Management API",
      version: "1.0.0",
      description: "API to create and manage tickets",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Ticket: {
          type: "object",
          required: ["title", "description"],
          properties: {
            id: {
              type: "string",
              description: "Unique ticket identifier",
              example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            },
            title: {
              type: "string",
              description: "Ticket title",
              example: "Fix login bug",
            },
            description: {
              type: "string",
              description: "Detailed description of the ticket",
              example:
                "Users are unable to login with special characters in password",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Ticket creation timestamp",
              example: "2025-11-17T10:30:00.000Z",
            },
          },
        },
      },
    },
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     description: Creates a new ticket with title and description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Fix login bug"
 *               description:
 *                 type: string
 *                 example: "Users are unable to login with special characters"
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.post("/tickets", (req, res) => {
  const { title, description } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      error: "Title and description are required fields",
    });
  }

  // Create new ticket
  const newTicket = {
    id: uuidv4(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  // Read existing tickets
  let tickets = readTickets();

  // Add new ticket
  tickets.push(newTicket);

  // Write back to file
  writeTickets(tickets);

  res.status(201).json(newTicket);
});

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Retrieves all tickets stored in the system
 *     responses:
 *       200:
 *         description: List of all tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
app.get("/tickets", (req, res) => {
  const tickets = readTickets();
  res.json(tickets);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Initialize and start server
initializeTicketsFile();

app.listen(PORT, () => {
  console.log(`🚀 Ticket API Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
