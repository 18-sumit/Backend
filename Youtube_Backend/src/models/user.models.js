import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true // more optimized way to enable searching 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // will be using cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // will be using cloudinary url
        },
        watchHisory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)


// mongoose hooks - pre is like just before saving data encrypt it .
// it is a middleware in mongoose

UserSchema.pre("save", async function (next) {

    // so that even saving anything else like avatar , coverimage , it will still update password so we have a condition
    // if password is not modified then call next method

    if (!this.isModified("password")) return next()

    // else run this

    this.password = await bcrypt.hash(this.password, 10)
    next() 
})

// to check weather the entered password is correct or not 
// and it is a custom method

UserSchema.methods.isPasswordCorrect = async function (password) {  // not arrow function because arrow function do not have context of this
    return await bcrypt.compare(password, this.password)

}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = async function () {
    jwt.sign(
        {
            _id : this._id 
        },
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema)



// in mongo db it will store it in all small case with plural : users