import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation   } from '@/schemas/signupSchema';

export async function POST(request: Request) {
    await dbConnect();


    try {
       const {username,code}=await request.json()
       const decodeUsername=decodeURIComponent(username)
       const user= await UserModel.findOne({username:decodeUsername})
       if(!user){
        return Response.json({
            success:false,
            message:"Username not found"
        },{status:404})
       }  

       const isCodeValid=user.verificationCode===code
       const isCodeNotExpired=new Date(user.verificationCodeExpiry)>new Date()

       if(isCodeValid && isCodeNotExpired){
        user.isVerified=true
       
        await user.save()
        
        return Response.json({
            success:true,
            message:"Username verified successfully"
        },{status:200})
       }

       else if(!isCodeValid){
        return Response.json({
            success:false,
            message:"Invalid verification code"
        },{status:400})
       }

       else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"Verification code expired"
        },{status:400})
       }

    } catch (error) {
        console.error('Error verifying username:', error);
        return Response.json(
          {
            success: false,
            message: 'Error verifying username',
          },
          { status: 500 }
        );
      }
}