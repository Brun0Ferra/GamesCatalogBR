import { SUPABASE_URL, API_KEY } from "./config.js";

export async function buscarCategorias(){
    const token = localStorage.getItem('sb_token')
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categorias?select=*`,{
        headers: {
            "apikey": API_KEY,
            "Authorization": `Bearer ${token}`
        }
    })
    return res.json()
}