const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const errorsMiddleware = require('./middlewares/errors.middleware');
const verifyTokensMiddleware = require('./middlewares/verify-tokens.middleware');

// routes
const { authRoute } = require('./routes/auth.route');
const { fileRoute } = require('./routes/file.route');

const { PORT = 8080, ALLOWED_ORIGIN } = process.env;

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    origin: '*',
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/', authRoute);
app.use('/file', verifyTokensMiddleware, fileRoute);

// app.use((req, res, next) => res.end());
app.use(errorsMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on ${`http://localhost:${PORT}`}`);
});
