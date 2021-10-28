let baseUrl = "https://api.themoviedb.org/3";
let apiKey = "3bf0718422e06d4d7d271d9d559a853f";
let timeWindow = "week";
let mediaType = "all"
let urlPopulares = `/trending/${mediaType}/${timeWindow}?api_key=${apiKey}&language=pt-BR`;

if(document.querySelector("#popularesDaSemana")){
    fetchHomePopulares(urlPopulares);
}

async function fetchHomePopulares(url){
    return fetch(`${baseUrl}${url}`)
    .then(resp => resp.json())
    .then(dados => criaGrid(dados.results))
    .catch(err => console.error(err))
}   

async function fetchDadosComplexosDoFilme(id){
    let urlDadosCompletos = `/movie/${id}?api_key=${apiKey}&language=pt-BR`
    return fetch(`${baseUrl}${urlDadosCompletos}`)
    .then(resp => resp.json())
    .then(dados => window.location.href = dados.homepage)
    .catch(err => console.error(err))
}

function criaGrid(dados){
    let titulo, imagem, descricao, tipo, vejamais, container, containerInfos;
    console.log(dados)
    dados.map(async filme =>{
        
        container = document.createElement("li");
        container.classList.add("containerFilme");

        imagem= document.createElement("img");
        imagem.src = `https://image.tmdb.org/t/p/w500${filme.poster_path ? filme.poster_path : filme.profile_path}`;

        containerInfos = document.createElement("div");
        containerInfos.classList.add("containerInfos");

        titulo = document.createElement("h2");
        titulo.textContent = filme.original_title ? filme.original_title : filme.name;

        descricao = document.createElement("p");
        descricao.textContent = filme.overview;

        tipo = document.createElement("p");
        tipo.textContent = filme.media_type;
        tipo.classList.add("tipo");

        vejamais = document.createElement("button");
        vejamais.textContent = "Veja mais";
        vejamais.setAttribute('data-idFilme', filme.id);
        vejamais.classList.add("botaovejamais");

        container.appendChild(imagem);
        containerInfos.appendChild(titulo);
        containerInfos.appendChild(tipo);
        containerInfos.appendChild(descricao);
        containerInfos.appendChild(vejamais);
        container.appendChild(containerInfos);

        if(document.querySelector("#popularesDaSemana")){
            document.querySelector("#popularesDaSemana").appendChild(container); 
        }else{
            document.querySelector("#gridResultadoPesquisa").appendChild(container);
        }
        
        
    });

    let botaoVejaMais = document.querySelectorAll(".botaovejamais");
    botaoVejaMais.forEach(botao => {
        botao.addEventListener('click', async(e) => {
            let filmeId = e.target.attributes["data-idFilme"].value;
            await fetchDadosComplexosDoFilme(filmeId) 
        })
    })  
}

if(document.querySelector("#form")){
    document.querySelector("#form").addEventListener("submit",function(e){
        e.preventDefault();

        let lista = document.querySelector("#gridResultadoPesquisa");
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
        let queryPesquisa = document.querySelector(".inputPesquisa").value;
        let url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${queryPesquisa}&page=1&include_adult=true`;
    
        return fetch(url)
        .then(resp => resp.json())
        .then(dados => criaGrid(dados.results))
        .catch(err => console.error(err))
    })
}
