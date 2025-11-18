import { SUPABASE_URL, API_KEY } from "./config.js";

export async function login(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if (res.ok) {
        localStorage.setItem('sb_token', data.access_token)
        return true
    } else {
        throw new Error(data.msg || "Erro no Login")
    }
}

export function logout() {
    localStorage.removeItem('sb_token') //remove o token
    window.location.href = 'index.html' //direciona para o login
}

export function verificaAutenticacao() {    
    const token = localStorage.getItem('sb_token')
    if (!token) { //se o token não existir..
        window.location.href = 'index.html'
        return false
    }
    return true
}

// Novo usuário
export async function signup(email, password) {  
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
   
    if (res.ok) {
      return true;
    } else {      
      throw new Error(data.msg || "Erro ao criar usuário");
    }
  }