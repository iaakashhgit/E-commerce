const mongoose = require('mongoose');

const { Schema } = mongoose;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
  {
    _id: String,
    name: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    userRole: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'user',
    },
    otherRole: {
      type: String,
      enum: ['sellerDashboard', 'adminDashboard', 'all', 'user'],
      default() {
        if (this.userRole === 'user') return 'user';
        if (this.userRole === 'seller') return 'sellerDashboard';
        if (this.userRole === 'admin') return 'adminDashboard';
        return 'all';
      },
    },
  },
  {
    timestamps: {
      createdAt: '_created_at',
      updatedAt: '_updated_at',
    },
    versionKey: false,
  },
);

UserSchema.methods.generateToken = function () {
  const payload = {
    user: {
      name: this.name,
      id: this.id,
      mobile: this.mobile,
      userRole: this.userRole,
    },
  };

  const token = jwt.sign(payload, process.env.SceretKey);
  return token;
};

const User = mongoose.model('User', UserSchema, 'User');
module.exports = User;
