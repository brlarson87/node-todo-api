const bcrypt = require('bcryptjs');

var password = 'blake';

bcrypt.genSalt(10, (err, salt) => {
  console.log('SALT:', salt);
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      return console.log(err);
    }

    console.log('HASH:', hash);
  });
})
