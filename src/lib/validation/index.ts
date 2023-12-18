
import * as z from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2,{message:'Nome tem de ter no minimo 2 caracteres!!'}),
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password tem de ter pelo menos 8 caracteres!!"}),
    docente: z.boolean().default(false),
    curso: z.string().min(2).max(50),
  })

  export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password tem de ter pelo menos 8 caracteres!!"}),
  })