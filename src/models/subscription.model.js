import mongoose,{Schema} from "mongoose";
import { User } from "./user.models.js";
const subscriptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, //One who is Subscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, //One to whom the subscriber is Subscribing
        ref:"User"
    }

},{
    timestamps:true
})
export const Subscription=mongoose.model("Subscription",subscriptionSchema)