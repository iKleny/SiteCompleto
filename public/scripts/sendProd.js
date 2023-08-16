$(document).on('click', '#comprar', ev => {
    const quantidade = parseInt($('#produtoQuantidade').text());
    const valor = valorFixoProduto * quantidade;
    const produto = $("#produto").val();
    const select = $("#select").val();

    if (select === null) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    $('#quantidade').val(quantidade);
    $('#valor').val(valor.toFixed(2));
    $('#pagamento').val(select)

    $('#compraForm').submit(); 
});