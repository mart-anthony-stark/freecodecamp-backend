const appendTime = (req, res, next) => {
  req.time = new Date().toString();
  next();
};

module.exports = appendTime;
