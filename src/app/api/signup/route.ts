import sendEmailVerification from "@/helpers/sendEmailVerification"; 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                { status: 400 }
            );
        }

        const existingUserByMail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByMail) {
            if (existingUserByMail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists"
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByMail.password = hashedPassword;
                existingUserByMail.verificationCode = verifyCode;
                existingUserByMail.verificationCodeExpiry = new Date();
                existingUserByMail.verificationCodeExpiry.setHours(
                    existingUserByMail.verificationCodeExpiry.getHours() + 1
                );
                await existingUserByMail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                 username,
                 email,
                 password: hashedPassword,
                 verifyCode,
                 verifyCodeExpiry: expiryDate,
                 isVerified: false,
                 isAcceptingMessages: true,
                 messages: [],
            });

            await newUser.save();
        }

        // Send email verification
        const emailResponse = await sendEmailVerification(email, verifyCode, username);
        


        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User created successfully! Please verify your email"
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error signing up", error);
        return Response.json(
            {
                success: false,
                message: "Error signing up"
            },
            { status: 500 }
        );
    }
}
