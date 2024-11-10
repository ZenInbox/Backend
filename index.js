const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./db");

dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173" , "https://zeninboxs.pages.dev"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.options("", cors({
    origin: ["http://localhost:5173" , "https://zeninboxs.pages.dev"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server");
});

connectToMongo();

const UserRouter = require("./Routes/User");
app.use("/api/user", UserRouter.router);

const EmailRouter = require("./Routes/Email")
app.use("/api/email", EmailRouter.router);

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});