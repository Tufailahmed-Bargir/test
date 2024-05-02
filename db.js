import express from 'express';
import pg from 'pg';
import ejs from 'ejs';
import bodyParser from 'body-parser'; // Use the correct package name

const app = express();
const port = 3000;

// **Improved connection handling with connection pool:**
const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "ahmed",
  password: "ahmed", // Use environment variables for sensitive data
  port: 5432
});

// **Connect to the database pool on app startup:**
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1); // Exit the application on connection failure
  } else {
    console.log('Connected to database pool');
  }
});

app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser

app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.post('/submit', async (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  console.log(req.body);
  console.log(name, pass);

  try {
    // **Prepared statements for security:**
    const client = await db.connect(); // Acquire a client from the pool
    const query = await client.query('INSERT INTO users(name, password) VALUES($1, $2)', [name, pass]);
    console.log('Successfully stored');
    await client.release(); // Release the client back to the pool
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error inserting data'); // Send a user-friendly error message
  }

  res.redirect('/'); // Redirect back to the main page after successful submission (optional)
});

app.listen(port, () => {
  console.log('Server started on port', port);
});

// **Handle potential pool termination:**
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Connection pool closed');
    process.exit(0);
  });
});
