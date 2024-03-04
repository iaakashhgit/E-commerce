const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js")
const ApiResponse = require("../utils/ApiResponse.js")
const { User } = require('../models/user.model.js')

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    try {
        const body = req.body
        const existedUser = await User.findOne({
            $or: [{ mobile: body.mobile }, { email: body.email }]
        })
        if (existedUser) {
            throw new ApiError(409, "User with email or name already exists")
        }

        const createUser = await User.create(body)
        const createdUser = await User.findById(createUser._id).select(
            "-password -refreshToken"
        )

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Something went wrong")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email && !password) {
            throw new ApiError(400, "email and password is required")
        }

        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(404, "User does not exist")
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials")
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Something went wrong")
    }
})

const updateUserDetails = asyncHandler(async (req, res) => {
    try {
        const { name, email } = req.body

        if (!name || !email) {
            throw new ApiError(400, "All fields are required")
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    name,
                    email: email
                }
            },
            { new: true }

        ).select("-password")

        return res
            .status(200)
            .json(new ApiResponse(200, user, "User details updated successfully"))

    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Something went wrong")
    }
});

module.exports = { registerUser, loginUser, updateUserDetails }
