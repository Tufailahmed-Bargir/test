import express from 'express'
import axios from 'axios'
const app = express();
const port = 3000;

app.get('/',async (req, res)=> {
    try {
        const response = await axios.get('https://bored-api.appbrewery.com/random')
        const result = response.data.activity;
        console.log(result);
        
    } catch (error) {
        console.error(error.message);
        
    }
    
});


 

app.listen(port, () => {
    console.log('Server started on port', port);
});
