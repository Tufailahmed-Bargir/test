const express = require("express");
const marked = require('marked');
const cheerio = require('cheerio');
const  pg =require( 'pg');
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000||process.env.PORT;

// database connection setup
const db = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "ahmed",
    password: "ahmed", // Use environment variables for sensitive data
    port: 5432
  });
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      process.exit(1); // Exit the application on connection failure
    } else {
      console.log('Connected to database pool');
    }
  });

app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render('index.ejs')
});

app.post('/submit', async function(req, res) {
    try {
        const inputCode = req.body.input;
        const type1 = req.body.type1;
        const type2 = req.body.type2;
        const query = `convert this legacy code {${inputCode}} written in {${type1}} to modern {${type2}}`
        const queryCode = `act as the legacy code converter and convert this legacy code {${inputCode}} written in {${type1}} to modern {${type2}} code. NOTE: don't include comments and also don't mention the language you are converting `;

     
        const API_KEY = process.env.KEY_API;
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const generationConfig = {
            temperature: 1,
            topK: 0,
            topP: 0.95,
            maxOutputTokens: 8192,
        };

        const chat = model.startChat({
            generationConfig,
            history: [],
        });

        
        const resultCode = await chat.sendMessage(queryCode);
        const convertedCode = resultCode.response.text();
        const html = marked.parse(convertedCode)
         
        const queryDocumentation = `generate documentation for the following code  ${convertedCode} NOTE: the documenation must not contain any special characters, it must look clean and clear also don't include markedown notations:`;
        const resultDocumentation = await chat.sendMessage(queryDocumentation);
        const documentation = resultDocumentation.response.text();
        
        console.log('query');
        console.log(convertedCode);
        console.log(documentation);
        // insertind the data into database
      const code_db = [convertedCode]
      const doc_db = [documentation]
         
            const client = await db.connect();  
            const queryy = await client.query('INSERT INTO legodata(question, code, documentation) VALUES($1, $2,$3)', [query, code_db, doc_db]);

            console.log('Successfully stored');
            await client.release();  
        
        
        
        res.render('index.ejs',{
            code: convertedCode,
              doc: documentation
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
});

// history rout here
app.get('/history' ,async(req,res) => {
    const client = await db.connect();  
    const queryy = await client.query('SELECT * FROM legodata');
    console.log(queryy.rows);
            
    res.render('history.ejs',{
        // question:queryy.rows[0].question,
        // code:queryy.rows[0].code,
        // doc:queryy.rows[0].documentation,
        data:queryy.rows,
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
