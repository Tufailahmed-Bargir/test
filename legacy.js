// node --version // Should be >= 18
// npm install @google/generative-ai

const express = require("express");
const app = express();
const port = 3000;
app.use(express.static('views'))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.render('index.ejs')
})

app.get('/plans',(req,res)=>{
    res.render('plans.ejs')
})

app.get('/FAQ',(req,res)=>{
    res.render('FAQ.ejs')
})

app.get('/Create',(req,res)=>{
    res.render('create-acc.ejs')
})

app.get('/sign-up',(req,res)=>{
    res.render('sign-up.ejs')
})

app.post('/',(req,res)=>{
    res.render('validation.ejs')
})


// app.post('/submit', (req, res) => {
//     const img = req.body.image;
//     // Assuming the image is base64 encoded
//     // const imgData = img.replace(/^data:image\/\w+;base64,/, '');
//     const buffer = Buffer.from(img, 'base64');

//     // Set the appropriate content type for the image
//     res.setHeader('Content-Type', 'image/png'); // Adjust the content type based on the image format

//     // Send the image data in the response
//     res.send(buffer);
// });


app.post('/submit', async function(req, res) {
    const code = req.body.input;
    
    var type1 = req.body.type1;
    
    const type2 = req.body.type2;
    const query =`act as the legacy code converter and convert this legacy code {${code}} written in {${type1}} to modern {${type2}} code and don't include comments only the executable code no explanation also don't mention the language like(python ,java, c++)  NOTE: code must be accurate and efficent`
    console.log('the whole query is ');
    console.log(query);
   
    // console.log(query);
    const {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
    } = require("@google/generative-ai");

    const MODEL_NAME = "gemini-1.5-pro-latest";
    const API_KEY = "AIzaSyCeGzZmKaRE5p5LuhatyKTP7z42gSHTt54";

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
    };

    // const safetySettings = [
    //     {
    //         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    //         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //     },
    // ];

    const chat = model.startChat({
        generationConfig,
        // safetySettings,
        history: [],
    });

    const result = await chat.sendMessage(query);
    
    const response = result.response;
    console.log(response.text());
    console.log(response);
    res.render('index.ejs',{
        data:response.text(),
        data2:response.text().replace(/[#*```]/g, '')
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
