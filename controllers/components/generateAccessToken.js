const jwt = require("jsonwebtoken");
require("dotenv").config();

// generate access token to log in
function generateAccessToken(data, age) {
  const maxAge = age;
  return jwt.sign({ data }, process.env.Access_token_secret, {
    expiresIn: maxAge,
  });
}
module.exports = { generateAccessToken };
