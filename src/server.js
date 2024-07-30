const express = require('express')
const router = require('./routes/index')
const cors = require('cors')

const app = express();

app.use(express.json());

app.use(cors())

app.use(router)

app.listen(3000, () => {
    console.log("Running server")
})