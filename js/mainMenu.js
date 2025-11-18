import { verificaAutenticacao } from "./modules/auth.js";
import { logoutUi } from "./ui/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    if(!verificaAutenticacao()) return    
    logoutUi() //habilita o listener no botão de logout
})