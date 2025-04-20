import {z} from 'zod'

export const usernameValidation=z
        .string()
        .min(2,"username must be atleast 2 characters")
        .max(20,"username must not be more than 20 characters")
        .regex(/^[a-zA-Z0-9]+$/,"Username must not contain special character")


export const signupSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email"}),
    password: z.string().min(6,"password must atleast have 6 characters")
})

