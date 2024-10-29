// const express  = require('express');
// modern syntax
import express from 'express';

const app = express();

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Server is ready')
})

// get a list of 5 jokes
// note : this is the api standardization  for fetching data

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: "Why don't scientists trust atoms?",
            content: "Because they make up everything!"
        },
        {
            id: 2,
            title: "What do you call fake spaghetti?",
            content: "An impasta!"
        },
        {
            id: 3,
            title: "Why did the scarecrow win an award?",
            content: "Because he was outstanding in his field!"
        },
        {
            id: 4,
            title: "What do you call cheese that isn't yours?",
            content: "Nacho cheese!"
        },
        {
            id: 5,
            title: "Why did the bicycle fall over?",
            content: "Because it was two-tired!"
        }
    ];
    res.send(jokes);
});



app.listen(port, () => {
    console.log(`Server is listening http://localhost:${port}`);

});
