import { buscarCategorias } from "../modules/categorias.js";

export async function carregarCategorias(){
    const dados = await buscarCategorias()
const tbody = document.getElementById('tabelaCategorias')
tbody.innerHTML = '' //limpamos o tbody
dados.forEach(categoria => {
    const tr = document.createElement('tr')
    const tipoClasse = categoria.tipo === 'receita'
    ? 'bg-green-200'
    : 'bg-red-200'
    tr.className =  `${tipoClasse}`
    tr.innerHTML = `
    <td class='border border-gray-400 p-2'>${categoria.descricao}</td>
    <td class='border border-gray-400 p-2'>${categoria.tipo}</td>
    `
    tbody.appendChild(tr) //adicionamos o tr na tbody
})
}