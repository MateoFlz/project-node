const  jwt = require('jsonwebtoken');

const secret = 'Rocco';


function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY3Njk1MjMyMn0.bkDxnA5hk5ENR-iqw4QwUgyS3UF9_S3soHkCZzbiMTg';
const  payload = verifyToken(token, secret);

console.log(payload);
