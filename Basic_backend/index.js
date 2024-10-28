require('dotenv').config()

const express = require('express');
const app = express();
const port = 5000;

const githubData = {

    "login": "18-sumit",
    "id": 142090100,
    "node_id": "U_kgDOCHgfdA",
    "avatar_url": "https://avatars.githubusercontent.com/u/142090100?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/18-sumit",
    "html_url": "https://github.com/18-sumit",
    "followers_url": "https://api.github.com/users/18-sumit/followers",
    "following_url": "https://api.github.com/users/18-sumit/following{/other_user}",
    "gists_url": "https://api.github.com/users/18-sumit/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/18-sumit/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/18-sumit/subscriptions",
    "organizations_url": "https://api.github.com/users/18-sumit/orgs",
    "repos_url": "https://api.github.com/users/18-sumit/repos",
    "events_url": "https://api.github.com/users/18-sumit/events{/privacy}",
    "received_events_url": "https://api.github.com/users/18-sumit/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Sumit Singh",
    "company": null,
    "blog": "",
    "location": "Mumbai , Maharashtra",
    "email": null,
    "hireable": null,
    "bio": "👨‍💻 3rd Year Computer Engineering Student | Full-Stack Developer",
    "twitter_username": null,
    "public_repos": 13,
    "public_gists": 0,
    "followers": 0,
    "following": 6,
    "created_at": "2023-08-12T10:23:44Z",
    "updated_at": "2024-10-28T06:31:21Z"
}


app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.get('/twitter', (req, res) => {
    res.send('Twitter API');
})

app.get('/login', (req, res) => {
    res.send('<h1>Hello World</h1>');

})

app.get('/youtube', (req, res) => {
    res.send('<h2>Chai aur code </h2?');
})

// handling json data 

app.get('/github' , (req , res) => {
    res.json(githubData)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`
    );
})