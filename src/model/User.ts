import mongoose ,{Document,Schema} from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

// User Schema
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    messages: Message[];

}


    const UserSchema : Schema<User> = new Schema({
        username:{
            type:String,
            unique:true,
            trim:true,
            required:[true,"Username is Required"]
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is Required"],
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is Required"],
        },
        verifyCode: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false, // Default set to true to allow messages
        },

        isAcceptingMessages: {
            type: Boolean,
            default: true, // Default set to true to allow messages
        },
        verifyCodeExpiry:{
            type:Date,
            required:true,
        },
        messages:[MessageSchema]
    })

    const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

    export default UserModel;
