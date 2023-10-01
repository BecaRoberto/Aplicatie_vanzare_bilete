const express = require('express');
const mysql = require('mysql'); 
const cors = require('cors'); 
const axios = require("axios"); 

const app = express(); // Inițializarea aplicației Express

app.use(express.json({ limit: '20mb' })); // Middleware pentru a procesa corpul cererilor JSON cu o limită de 20mb
app.use(cors()); // Middleware pentru a permite cereri cross-origin

// Configurarea conexiunii la baza de date MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sistem"
});

// Conectarea la baza de date MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
  } else {
    console.log("Connected to the database");
  }
});

// Definirea unui endpoint pentru înregistrarea utilizatorilor
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Executarea unei interogări SQL pentru inserarea datelor în tabela "users"
  db.query("INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    (err, result) => {
      console.log(err);
    }
  );
});

// Definirea unui endpoint pentru autentificare
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Executarea unei interogări SQL pentru a verifica credențialele utilizatorului
  db.query("SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send({ redirect: '/Template' });
      } else {
        res.send({ message: "Wrong email/password combination!" });
      }
    }
  );
});

// Definirea unui endpoint pentru crearea unui eveniment
app.post('/createEvent', (req, res) => {
  console.log("Received createEvent request");
  const { eventName, location, date, hour, description, photos, price } = req.body;

  // Executarea unei interogări SQL pentru inserarea datelor în tabela "eventdb"
  db.query(
    "INSERT INTO eventdb (eventName, location, date, hour, description, photos, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [eventName, location, date, hour, description, photos, price],
    (err, result) => {
      if (err) {
        console.error("Error inserting event into database: ", err);
        res.status(500).send({ message: "Error inserting event into database" });
      } else {
        res.status(200).send({ message: "Event created successfully" });
      }
    }
  );
});

// Definirea unui endpoint pentru trimiterea de e-mailuri folosind serviciul SendGrid
app.post("/api/send-email", async (req, res) => {
  const { recipientEmail, senderEmail, subject, message, sendGridApiKey } = req.body;

  try {
    // Efectuarea unei cereri HTTP POST către API-ul SendGrid pentru a trimite e-mailul
    const response = await axios.post(
      "https://api.sendgrid.com/v3/mail/send",
      {
        personalizations: [
          {
            to: [
              {
                email: recipientEmail,
              },
            ],
            subject: subject,
          },
        ],
        from: {
          email: senderEmail,
        },
        content: [
          {
            type: "text/plain",
            value: message,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sendGridApiKey}`,
        },
      }
    );

    console.log("Email sent successfully:", response.data);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "An error occurred while sending the email" });
  }
});

// Pornirea serverului pe portul 1433
app.listen(1433, () => {
  console.log('Server running on port 1433');
});
