document.addEventListener("DOMContentLoaded", function () {
    // Referências aos elementos
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Função para alternar a visibilidade do sidebar
    function toggleSidebar() {
        if (sidebar.style.display === 'block') {
            sidebar.style.display = 'none'; // Oculta o sidebar
        } else {
            sidebar.style.display = 'block'; // Exibe o sidebar
        }
    }

    // Adiciona o evento de clique ao botão de alternância
    menuToggle.addEventListener('click', toggleSidebar);

    // Monitora o redimensionamento da tela
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            sidebar.style.display = 'none'; // Garante que o sidebar esteja oculto em telas grandes
        }
    });

    carregarExcelAutomaticamente();
    adicionarBotaoWhatsApp();
});

function carregarExcelAutomaticamente() {
    const caminhoDoArquivo = "catalogo_produtos.xlsx";

    fetch(caminhoDoArquivo)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Arquivo não encontrado ou erro na rede");
            }
            return response.arrayBuffer();
        })
        .then((data) => {
            const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const produtos = XLSX.utils.sheet_to_json(sheet);
            exibirProdutos(produtos); // Exibe todos os produtos
            preencherListaDepartamentos(produtos); // Preenche a lista de departamentos
            configurarFiltroDepartamento(produtos); // Configura o filtro por departamento
            configurarBuscaDinamica(produtos); // Configura a busca dinâmica
            configurarOrdenacao(produtos); // Configura a ordenação
        })
        .catch((error) => {
            console.error("Erro ao carregar o arquivo Excel:", error);
        });
}

function exibirProdutos(produtos) {
    const gradeProdutos = document.getElementById("grade-produtos");
    gradeProdutos.innerHTML = "";

    produtos.forEach((produto) => {
        const divProduto = document.createElement("div");
        divProduto.classList.add("produto");
        divProduto.innerHTML = `
            <img src="imagens/${produto.Imagem}" alt="${produto.Nome}">
            <h3>${produto.Nome}</h3>
            <p>${produto.Departamento}</p>
        `;
        gradeProdutos.appendChild(divProduto);
    });
}

function preencherListaDepartamentos(produtos) {
    const listaDepartamentos = document.getElementById("lista-departamentos");
    const listaDepartamentosSidebar = document.getElementById("lista-departamentos-sidebar");
    const departamentos = [...new Set(produtos.map(produto => produto.Departamento || "Outros"))];

    // Limpa as listas antes de preencher
    listaDepartamentos.innerHTML = '<option value="">Todos os departamentos</option>';
    listaDepartamentosSidebar.innerHTML = '<li data-value="">Todos os departamentos</li>';

    departamentos.forEach(departamento => {
        // Adiciona opção à ListBox
        const option = document.createElement("option");
        option.value = departamento;
        option.textContent = departamento;
        listaDepartamentos.appendChild(option);

        // Adiciona opção ao menu lateral
        const li = document.createElement("li");
        li.textContent = departamento;
        li.setAttribute("data-value", departamento);
        listaDepartamentosSidebar.appendChild(li);
    });

    // Adiciona evento de clique ao menu lateral
    listaDepartamentosSidebar.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const departamentoSelecionado = event.target.getAttribute("data-value");
            listaDepartamentos.value = departamentoSelecionado;
            listaDepartamentos.dispatchEvent(new Event("change")); // Dispara o evento de mudança

            // Oculta o sidebar após a seleção
            const sidebar = document.getElementById('sidebar');
            sidebar.style.display = 'none';
        }
    });
}

function configurarFiltroDepartamento(produtos) {
    const listaDepartamentos = document.getElementById("lista-departamentos");
    const departamentoColuna = document.querySelector(".departamento-coluna h2");

    listaDepartamentos.addEventListener("change", function () {
        const departamentoSelecionado = this.value;

        // Atualiza o nome do departamento na coluna
        if (departamentoSelecionado) {
            departamentoColuna.textContent = departamentoSelecionado;
        } else {
            departamentoColuna.textContent = "Todos os departamentos";
        }

        // Filtra os produtos
        const produtosFiltrados = departamentoSelecionado
            ? produtos.filter(produto => produto.Departamento === departamentoSelecionado)
            : produtos;

        // Exibe os produtos filtrados
        exibirProdutos(produtosFiltrados);
    });
}

function configurarBuscaDinamica(produtos) {
    const campoBusca = document.querySelector(".buscador input");

    campoBusca.addEventListener("input", () => {
        const termoBusca = campoBusca.value.toLowerCase();
        const produtosFiltrados = produtos.filter(produto =>
            produto.Nome.toLowerCase().includes(termoBusca) ||
            produto.Departamento.toLowerCase().includes(termoBusca)
        );
        exibirProdutos(produtosFiltrados);
    });
}

function configurarOrdenacao(produtos) {
    const ordenarProdutos = document.getElementById("ordenar-produtos");

    ordenarProdutos.addEventListener("change", function () {
        const ordem = this.value;
        let produtosOrdenados;

        if (ordem === "az") {
            // Ordena de A-Z
            produtosOrdenados = produtos.sort((a, b) => a.Nome.localeCompare(b.Nome));
        } else if (ordem === "za") {
            // Ordena de Z-A
            produtosOrdenados = produtos.sort((a, b) => b.Nome.localeCompare(a.Nome));
        }

        // Exibe os produtos ordenados
        exibirProdutos(produtosOrdenados);
    });
}

function adicionarBotaoWhatsApp() {
    setTimeout(function () {
        const css = `
            .gen123 {
                position: fixed;
                width: 4em;
                height: 4em;
                z-index: 100;
            }
            .gen123 svg {
                width: 100%;
                height: 100%;
            }
            .gen123.top {
                top: 5em;
            }
            .gen123.bottom {
                bottom: 5em;
            }
            .gen123.left {
                left: 3em;
            }
            .gen123.right {
                right: 3em;
            }
        `;
        const style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        const linkWhatsApp = document.createElement("a");
        linkWhatsApp.href = "https://wa.me/31972132922";
        linkWhatsApp.target = "_blank";
        linkWhatsApp.className = "gen123 bottom right";

        const svgWhatsApp = `
            <svg enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg">
                <path d="m20.52 3.449c-2.28-2.204-5.28-3.449-8.475-3.449-9.17 0-14.928 9.935-10.349 17.838l-1.696 6.162 6.335-1.652c2.76 1.491 5.021 1.359 5.716 1.447 10.633 0 15.926-12.864 8.454-20.307z" fill="#eceff1"/>
                <path d="m12.067 21.751-.006-.001h-.016c-3.182 0-5.215-1.507-5.415-1.594l-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-8.793 10.745-13.19 16.963-6.975 6.203 6.15 1.848 16.875-7.026 16.875z" fill="#4caf50"/>
                <path d="m17.507 14.307-.009.075c-.301-.15-1.767-.867-2.04-.966-.613-.227-.44-.036-1.617 1.312-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.293-.506.32-.578.878-1.634.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.576-.05-.997-.042-1.368.344-1.614 1.774-1.207 3.604.174 5.55 2.714 3.552 4.16 4.206 6.804 5.114.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" fill="#fafafa"/>
            </svg>
        `;
        linkWhatsApp.innerHTML = svgWhatsApp;
        document.body.appendChild(linkWhatsApp);
    }, 2000);
}