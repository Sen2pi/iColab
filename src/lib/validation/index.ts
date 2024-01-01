
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
    name: z.string().min(2, { message: "Nome tem de ter pelo menos dois caracteres" }),
    username: z.string().min(2, { message: "UserName tem de ter pelo menos dois caracteres" }),
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
  inicio: z.date({
    required_error: "A date of birth is required.",
  }),
  fim: z.date({
    required_error: "A date of birth is required.",
  }),
  curso: z.string(),
});

// ============================================================
// Modulo
// ============================================================
export const ModuloValidation = z.object({
  disciplinas: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  nome: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  descricao: z.string().min(0, { message: "This field is required" }).max(2200, { message: "Maximum 1000 characters." }),
  file: z.custom<File[]>(),
});

// ============================================================
// Ficheiro
// ============================================================
export const FicheiroValidation = z.object({
    remetente: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    requesito: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    grupo: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    nome: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    data: z.date({
      required_error: "O prazo final de entrega é necessario",
    }),
    file: z.custom<File[]>(),
});

// ============================================================
// Grupo
// ============================================================
export const GrupoValidation = z.object({
  disciplina: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  nome: z.string().min(0, { message: "Minimum 5 characters." }).max(200, { message: "Maximum 200 caracters" }),
  descricao: z.string().min(1, { message: "This field is required" }).max(2200, { message: "Maximum 1000 characters." }),
  tema:z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2200 caracters" }),
  prazo: z.date({
    required_error: "O prazo final de entrega é necessario",
  }),
  lider: z.string().min(0, { message: "Minimum 5 characters"}),
});

// ============================================================
// Requesito
// ============================================================
export const RequesitoValidation = z.object({
  title: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  grupo: z.string().min(0, { message: "Minimum 5 characters." }).max(200, { message: "Maximum 200 caracters" }),
  user: z.string().min(0, { message: "This field is required" }).max(2200, { message: "Maximum 1000 characters." }),
});
// ============================================================
// TAREFA
// ============================================================
export const TarefaValidation = z.object({
  grupo: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  concluido: z.boolean(),
  atribuido: z.string().min(1, { message: "This field is required" }).max(2200, { message: "Maximum 1000 characters." }),
  content:z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2200 caracters" }),
  date: z.date({
    required_error: "O prazo final de entrega é necessario",
  }),
  requesito: z.string().min(0, { message: "Minimum 5 characters"}),
});

// ============================================================
// NOTAS
// ============================================================
export const NotaValidation = z.object({
  nota: z.string().min(0, { message: "This field is required" }).max(4, { message: "max 4" }),
  momento:z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2200 caracters" }),
});