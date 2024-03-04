const mongoose = require('mongoose');
const uuid = require('uuid')
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

const UserSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => uuid.v4()
        },
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
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
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

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.createUser = async function (userDetails) {
    try {
        const data = new this(userDetails);
        return data.save();
    } catch (error) {
        throw new Error(`Error saving message: ${error.message}`);
    }
}

UserSchema.methods.generateToken = function () {
    const payload = {
        user: {
            name: this.name,
            id: this.id,
            mobile: this.mobile,
            userRole: this.userRole,
        },
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return token;
};

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', UserSchema, 'User');
module.exports = { User };