'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import  * as z  from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signupSchema } from '@/schemas/signupSchema'
import axios ,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { set } from 'mongoose'
import { Form ,FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'


const page= () =>{
  const [username, setUsername] = useState('')
  const[usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  
  const router = useRouter();
  const form =useForm({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      username: '',
      email: '',
      password: ''
    }
  })


  useEffect(() => {
    const checkUsernameUnique= async () => {
      if(username){
        setIsCheckingUsername(true)
        // console.log("checking username",username);   
        setUsernameMessage('')
        try {

            console.log("checking username",username);
          const response =await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
          setIsCheckingUsername(false)
        } catch (error) {
            console.error("Raw error object:", error);

            const axiosError = error as AxiosError<ApiResponse>;
            
            console.error("Axios error message:", axiosError.message);
            console.error("Axios error response data:", axiosError.response?.data);
            console.error("Axios error response status:", axiosError.response?.status);
            console.error("Axios error response headers:", axiosError.response?.headers);
          
            setUsernameMessage(axiosError.response?.data?.message || 'An error occurred while checking the username');
            setIsCheckingUsername(false);
        }
      }
  }

  checkUsernameUnique()
}
  , [username])


  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      setUsername(data.username); // ✅ this is crucial!
      const response = await axios.post<ApiResponse>('/api/signup', data);
      toast.success(response.data.message);
      console.log("Redirecting to", `/verify/${data.username}`);
      setTimeout(() => {
        router.replace(`/verify/${data.username}`);
      }, 2000); // faster feedback
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('An error occurred during sign-up.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
         <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800'>Join Mystery Message</h1>
          <p className='mb-4 text-gray-600'>Create an account to start sending and receiving anonymous messages.</p>
          </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced  (e.target.value)
                }} />
              </FormControl>

              {isCheckingUsername && <Loader2 className="animate-spin" />}
              <p className={` text-sm ${usernameMessage==="Username is unique"? "text-green-500" : "text-red-500"}`}>

                test {usernameMessage}

                </p>              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
               />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
              isSubmitting?(
                <>
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                Please wait
                </>
              ):('Signup')
          }
          
        </Button>
        </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      </div>
  )
}

export default page


