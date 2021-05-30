const express = require('express')
const app = express()
const port = 3001

const api = require('./routes/index');
app.use('/api', api);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})