import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export default async function sendEmailVerification(
    email:string,
    username: string, 
    verifyCode: string
): Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'ShadowSpeak || Verification code',
            react: VerificationEmail({username, otp: verifyCode}),
          });

        return {success: true, message: "Email sent"};

        
    } catch (emailError) {
        console.log("Error sending email", emailError);
        return {  success: false, message: "Error sending email" };
    }
}                         