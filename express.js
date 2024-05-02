import express from 'express'
const app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.send('<h1>hi</h1><input type="text"><button>submit</button>');
});

 

app.listen(port, () => {
    console.log('Server started on port', port);
});
