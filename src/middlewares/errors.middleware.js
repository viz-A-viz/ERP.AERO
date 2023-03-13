const HttpError = require('http-errors');

module.exports = (error, req, res, next) => {
  if (error instanceof HttpError)
    return res.status(error.status).json({ message: error.message });
  return res.status(500).json(error);
};
