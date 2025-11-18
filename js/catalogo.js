// Variáveis e elementos

const modal = document.getElementById('modalPesquisaJogo');
const fecharModal = document.getElementById('fecharModal');
const listaResultados = document.getElementById('listaResultados');
const avaliacaoJogo = document.getElementById('avaliacaoJogo');
const nomeJogoSelecionado = document.getElementById('nomeJogoSelecionado');
const capaJogoSelecionado = document.getElementById('capaJogoSelecionado');
const enviarAvaliacao = document.getElementById('enviarAvaliacao');
const campoPesquisa = document.getElementById('campoPesquisa');
const estrelasContainer = document.getElementById('estrelas');
const comentarioJogo = document.getElementById('comentarioJogo');
const catalogoLista = document.getElementById("catalogoLista");

let notaSelecionada = 0;



// Abrir / Fechar Modal

document.getElementById('botaoAdicionarJogo').addEventListener('click', () => {
    modal.classList.remove('hidden');
    campoPesquisa.focus();
});

fecharModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    listaResultados.innerHTML = '';
    avaliacaoJogo.classList.add('hidden');
    campoPesquisa.value = '';
    resetarEstrelas();
    comentarioJogo.value = '';
});


// Buscar jogos RAWG

async function buscarJogos(termo) {
    const key = '0e8cc98c95eb4f85b0b8f170f1954f29';
    const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(termo)}&key=${key}&page_size=5`;
    const res = await fetch(url);
    return (await res.json()).results;
}

campoPesquisa.addEventListener('input', async () => {
    const termo = campoPesquisa.value.trim();
    listaResultados.innerHTML = '';
    avaliacaoJogo.classList.add('hidden');
    resetarEstrelas();
    comentarioJogo.value = '';

    if (!termo) return;

    const jogos = await buscarJogos(termo);

    jogos.forEach(jogo => {
        const div = document.createElement('div');
        div.className = 'p-2 bg-gray-700 text-white rounded cursor-pointer flex items-center hover:bg-gray-600';
        div.innerHTML = `<img src="${jogo.background_image}" class="w-12 h-12 mr-3 rounded"> ${jogo.name}`;
        listaResultados.appendChild(div);

        div.addEventListener('click', () => {
            nomeJogoSelecionado.textContent = jogo.name;
            capaJogoSelecionado.src = jogo.background_image;
            listaResultados.innerHTML = '';
            avaliacaoJogo.classList.remove('hidden');
            campoPesquisa.value = '';
        });
    });
});

// Sistema de estrelas

function criarEstrelas() {
    estrelasContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const estrela = document.createElement('span');
        estrela.className = 'estrela text-2xl text-gray-400 cursor-pointer';
        estrela.innerHTML = '&#9733;';
        estrelasContainer.appendChild(estrela);

        estrela.addEventListener('click', () => {
            notaSelecionada = i + 1;
            atualizarEstrelas();
        });
        estrela.addEventListener('mouseover', () => {
            atualizarEstrelas(i + 1);
        });
        estrela.addEventListener('mouseout', () => {
            atualizarEstrelas();
        });
    }
}

function atualizarEstrelas(temp = 0) {
    const estrelas = document.querySelectorAll('#estrelas .estrela');
    estrelas.forEach((estrela, index) => {
        estrela.classList.toggle('text-yellow-400', index < (temp || notaSelecionada));
    });
}

function resetarEstrelas() {
    notaSelecionada = 0;
    atualizarEstrelas();
}

criarEstrelas();

// SALVAR NO LOCALSTORAGE

function salvarJogoLocal(jogo) {
    let catalogo = JSON.parse(localStorage.getItem("catalogoJogos")) || [];
    catalogo.push(jogo);
    localStorage.setItem("catalogoJogos", JSON.stringify(catalogo));
}


// CARREGAR CATÁLOGO (com botão excluir)

function carregarCatalogo() {
    catalogoLista.innerHTML = "";

    const catalogo = JSON.parse(localStorage.getItem("catalogoJogos")) || [];

    if (catalogo.length === 0) {
        catalogoLista.innerHTML = "<p class='text-gray-300'>Nenhum jogo adicionado ainda.</p>";
        return;
    }

    catalogo.forEach((jogo, index) => {
        const card = document.createElement("div");
        card.className = "bg-gray-800 p-3 rounded shadow text-white relative group";

        card.innerHTML = `
            <button 
                class="absolute top-2 right-2 opacity-40 group-hover:opacity-100 
                       text-red-500 hover:text-red-700 transition"
                data-index="${index}"
            >
                <span class="material-symbols-outlined text-lg">delete</span>
            </button>

            <img src="${jogo.capa}" class="w-full h-40 object-cover rounded mb-2">
            <h3 class="font-bold text-sm">${jogo.nome}</h3>
            <p class="text-yellow-400">⭐ ${jogo.nota}/5</p>
            <p class="text-gray-300 text-xs mt-1">${jogo.comentario}</p>
        `;

        catalogoLista.appendChild(card);

        card.querySelector("button").addEventListener("click", () => excluirJogo(index));
    });
}



// EXCLUIR JOGO

function excluirJogo(index) {
    let catalogo = JSON.parse(localStorage.getItem("catalogoJogos")) || [];

    Swal.fire({
        title: "Excluir jogo?",
        text: "Essa ação não poderá ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Excluir",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            catalogo.splice(index, 1);
            localStorage.setItem("catalogoJogos", JSON.stringify(catalogo));
            carregarCatalogo();
        }
    });
}



// Enviar avaliação
enviarAvaliacao.addEventListener('click', () => {
    if (notaSelecionada === 0 || !comentarioJogo.value.trim()) {
        Swal.fire('Erro', 'Escolha uma nota e escreva um comentário!', 'error');
        return;
    }

    Swal.fire('Obrigado!', `Sua avaliação do ${nomeJogoSelecionado.textContent} foi enviada.`, 'success');

    const jogoSalvo = {
        nome: nomeJogoSelecionado.textContent,
        capa: capaJogoSelecionado.src,
        nota: notaSelecionada,
        comentario: comentarioJogo.value.trim()
    };

    salvarJogoLocal(jogoSalvo);
    carregarCatalogo();

    avaliacaoJogo.classList.add('hidden');
    resetarEstrelas();
    comentarioJogo.value = '';
    modal.classList.add('hidden');
});

carregarCatalogo();
