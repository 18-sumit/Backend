const express = require('express')

const app = express()

port = 3000

app.get('/', (req , res) => {
    res.send('Hello welcome to Data Modelling')
})

app.listen(port , () => {
    console.log(`Server runnig on port :${port}`)
})