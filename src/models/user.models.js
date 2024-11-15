import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      requried: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
      requried: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      requried: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, //Cloudinary Url
      requried: true,
    },
    coverImage: {
      type: String, //Cloudinary Url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      requried: [true, "Password Is Requried"],
    },
    refreshTokens: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
        this.password = bcrypt.hash(this.password, 10);
        next();
});
userSchema.methods.IsPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.GenerateAccessToken=function (){
    return jwt.sign({
       _id:this._id,
       email:this.email,
       username:this.username,
       fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.GenerateRefreshToken=function (){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname: this.fullname
     },
     process.env.REFRESH_TOKEN_SECRET,
     {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     })
}
export const User = mongoose.model("User", userSchema);
