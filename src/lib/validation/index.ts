
import * as z from "zod"
// ============================================================
// USER
// ============================================================
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

  export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
  });

// ============================================================
// Disciplina
// ============================================================
export const DisciplinaValidation = z.object({
  professor: z.string().min(0).max(50, { message: "Maximum 50 characters" }),
  nome: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  descricao: z.string().min(1, { message: "This field is required" }).max(2200, { message: "Maximum 1000 characters." }),
  file: z.custom<File[]>(),
  ano: z.string().min(0,{message:" O minimo aceitavel é 2023 para o ano"}).max(4),
  inicio: z.string(),
  fim: z.string(),
  curso: z.string(),
});