const express = require("express");
const marked = require('marked');
const cheerio = require('cheerio');
// const  pg =require( 'pg');
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3001 ||process.env.PORT;

// database connection setup
// const db = new pg.Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "ahmed",
//     password: "ahmed", // Use environment variables for sensitive data
//     port: 5432
//   });
//   db.connect((err) => {
//     if (err) {
//       console.error('Error connecting to database:', err.message);
//       process.exit(1); // Exit the application on connection failure
//     } else {
//       console.log('Connected to database pool');
//     }
//   });

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

     
        const MMEC = 'AIzaSyCeGzZmKaRE5p5LuhatyKTP7z42gSHTt54';
        const genAI = new GoogleGenerativeAI(MMEC);
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
    //   const code_db = [convertedCode]/
    //   const doc_db = [documentation]
         
            // const client = await db.connect();  
            // const queryy = await client.query('INSERT INTO legodata(question, code, documentation) VALUES($1, $2,$3)', [query, code_db, doc_db]);

            // console.log('Successfully stored');
            // await client.release();  
        
        
        
        res.render('index.ejs',{
            code: convertedCode,
              doc: documentation
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
});

app.get('/history', function(req, res){
    res.render('history.ejs',{
        data:[{
            id: 1,
            question: `convert this legacy code {' This is a legacy VB code snippet Sub HelloWorld()     MsgBox "Hello, World!" End Sub} written in {VB} to modern {Java}`,
            code: '{"```java\n' +
              'import javax.swing.JOptionPane;\n' +
              '\n' +
              'public class Main {\n' +
              '    public static void main(String[] args) {\n' +
              '        JOptionPane.showMessageDialog(null, \\"Hello, World!\\");\n' +
              '    }\n' +
              '}\n' +
              '```"}',
            documentation: '{"Main Class \n' +
              '\n' +
              'This class contains the main method, the entry point for the program.\n' +
              '\n' +
              'main Method\n' +
              '\n' +
              'This method is the starting point of the program execution. \n' +
              'It displays a dialog box with the message \\"Hello, World!\\".\n' +
              '"}'
          },
          {
            id: 2,
            question: 'convert this legacy code { Sub HelloWorld()     MsgBox "Hello, World!" End Sub} written in {VB} to modern {C++}',
            code: '{"```cpp\n' +
              '#include <iostream>\n' +
              '\n' +
              'int main() {\n' +
              '  std::cout << \\"Hello, World!\\" << std::endl;\n' +
              '  return 0;\n' +
              '}\n' +
              '``` \n' +
              '"}',
            documentation: '{" Program: Hello World \n' +
              '\n' +
              ' This program demonstrates a simple \\"Hello, World!\\" output in C++.\n' +
              '\n' +
              ' Includes:\n' +
              ' iostream: This header file provides input and output functionalities in C++.\n' +
              '\n' +
              ' Function: main\n' +
              '  The main function is the entry point of any C++ program. \n' +
              '\n' +
              '  Functionality:\n' +
              '  - Prints the message \\"Hello, World!\\" to the console.\n' +
              '  - Returns 0, indicating successful program execution. \n' +
              '"}'
          },
          {
            id: 3,
            question: 'convert this legacy code { Sub HelloWorld()     MsgBox "Hello, World!" End Sub} written in {val1} to modern {C#}',
            code: '{"```C#\n' +
              ' public static void HelloWorld()\n' +
              ' {\n' +
              '      System.Windows.Forms.MessageBox.Show(\\"Hello, World!\\");\n' +
              ' }\n' +
              '```"}',
            documentation: '{"HelloWorld Function\n' +
              '\n' +
              'This function displays a message box containing the text \\"Hello, World!\\". \n' +
              '"}'
          },
          {
            id: 4,
            question: 'convert this legacy code { Sub HelloWorld()     MsgBox "Hello, World!" End Sub} written in {VB} to modern {Python}',
            code: '{"```python\n' +
              'import tkinter as tk\n' +
              'from tkinter import messagebox\n' +
              '\n' +
              'def HelloWorld():\n' +
              '    messagebox.showinfo(\\"Message\\", \\"Hello, World!\\")\n' +
              '\n' +
              'HelloWorld()\n' +
              '```"}',
            documentation: '{"This Python code creates a simple graphical window that displays a \\"Hello, World!\\" message. \n' +
              '\n' +
              'It utilizes the tkinter library for creating the graphical user interface. \n' +
              '\n' +
              'The code defines a function called HelloWorld. This function uses messagebox.showinfo to display a message box with the title \\"Message\\" and the message \\"Hello, World!\\".\n' +
              '\n' +
              'Finally, the HelloWorld function is called, resulting in the message box appearing on the screen. \n' +
              '"}'
          }]
    })
})

// history rout here
// app.get('/history' ,async(req,res) => {
//     const client = await db.connect();  
//     // const queryy = await client.query('SELECT * FROM legodata');
//     console.log(queryy.rows);
            
//     res.render('history.ejs',{
//         // question:queryy.rows[0].question,
//         // code:queryy.rows[0].code,
//         // doc:queryy.rows[0].documentation,
//         data:queryy.rows,
//     });
// });

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
