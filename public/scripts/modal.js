let valorFixoProduto = 0; 
function abrirModal(produto, descricao, preco, imagem) {
    
    $('#produto').val(produto);
    $('#quantidade').val(1); 
    $('#pagamento').val(""); 
    valorFixoProduto = parseFloat(preco);

    
    let conteudo = `
        <div class="card border border-dark border-1">
            <img class="card-img-top mx-auto" style="width: 10rem;" src="${imagem}" alt="${produto} image">
            <div class="card-body text-center">
                <h3 class="card-title text-secondary text-capitalize">${produto}</h3>
                <p class="card-text">${descricao}</p>
            </div>
        </div>
    `;

    
    let footer = `
        <!-- Botões específicos do footer do modal -->
        <button id="subtracao" type="button" class="btn btn-outline-secondary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>

                    <h4 name="valor" class="m-1">R$ <strong id="produtoValor">${preco}</strong></h4>

                    <button id="adicao" type="button" class="btn btn-outline-secondary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>
                    <h4 name="quantidade" type="number">Qnt: <strong id="produtoQuantidade">1</strong></h4>
                    <select name="select" id="select" class="form-select" aria-label="Default select example" required>
                        <option value="" disabled selected hidden>Modo de pagamento</option>
                        <option value="cartao">Cartão</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">Pix</option>
                    </select>
                    <button type="button" class="btn btn-secondary ms-5" data-bs-dismiss="modal">Fechar</button>
                    <button id="comprar" type="submit" class="btn btn-primary">Comprar</button>
    `;
    
    $('#cardContent').html(conteudo);
    $('#cardFooter').html(footer);
    $("#subtracao").hide();
    $('#cardModal').modal('show');
}