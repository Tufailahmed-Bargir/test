const express = require("express");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

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

        const queryCode = `act as the legacy code converter and convert this legacy code {${inputCode}} written in {${type1}} to modern {${type2}} code. NOTE: don't include comments and also don't mention the language you are converting`;

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

        // Generate code
        const resultCode = await chat.sendMessage(queryCode);
        const convertedCode = resultCode.response.text();

        // Generate documentation
        const queryDocumentation = `generate documentation for the following code NOTE: the documenation must not contain any special characters, it must look clean and clear: ${convertedCode}`;
        const resultDocumentation = await chat.sendMessage(queryDocumentation);
        const documentation = resultDocumentation.response.text();

     
        // Render the formatted code and documentation in the view template
        res.render('index.ejs', {
            code: convertedCode,
            doc: documentation
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});