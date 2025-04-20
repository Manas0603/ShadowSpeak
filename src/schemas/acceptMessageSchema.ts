import z from 'zod'
// import  { boolean } from 'zod'

export const acceptMessageSchema= z.object({
    acceptMessage:z.boolean()
})