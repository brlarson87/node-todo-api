const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  }
});

module.exports = {User};

// var newUser = new User({
//   email: 'brlarson87@gmail.com',
//   name: 'Blake'
// });
//
// newUser.save().then((doc) => {
//   console.log('User saved', doc);
// }, (e) => {
//   console.log('unable to save user', e);
// });
