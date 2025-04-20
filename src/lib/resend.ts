import { Resend } from 'resend';

console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);
// Check if the environment variable is set

// if (!process.env.RESEND_API_KEY) {
//   console.log(process.env.RESEND_API_KEY)
//   throw new Error("Missing RESEND_API_KEY in environment variables");
// }

export const resend = new Resend("re_CiZVrcTj_2ry3Ue5goU1VKj8ipsjHZu92");
