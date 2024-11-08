const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String},
  email: { type: String, unique: true },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;