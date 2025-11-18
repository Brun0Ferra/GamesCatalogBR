import { verificaAutenticacao } from "./modules/auth.js";
import { logoutUi } from "./ui/auth.js";
import { carregarCategorias } from "./ui/categorias.js";

document.addEventListener('DOMContentLoaded', () => {
    if(!verificaAutenticacao()) return    
    logoutUi() //habilita o listener no botão de logout
    carregarCategorias() //obtém as categorias do supabase
})