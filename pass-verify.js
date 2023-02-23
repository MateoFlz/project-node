const bcrypt = require('bcrypt');


async function verifyPassword() {

  const myPassword = 'admin 123 123';
  const hash = '$2b$10$WhnXrzztv2t3GLyMBsiBh.n.Q8rGGOhjNnE0WMUUx6xfqEa6F/BY.';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);

}

verifyPassword();

