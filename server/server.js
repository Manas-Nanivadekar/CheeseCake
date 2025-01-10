const express = require('express')
const router = require('./routes/user')
const app = express()
const cookieParser = require('cookie-parser');
const { authenticateUser, isAdmin } = require('./utils/middleware');
const coursesRouter = require('./routes/courses');
app.use(cookieParser());

app.use(express.json())
app.use('/api', router)
app.use('/course', authenticateUser, isAdmin,coursesRouter)

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})