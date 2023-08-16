$(document).on('click', '#adicao', ev => {
  const quantidadeAtual = parseInt($('#produtoQuantidade').text());
  const novoValor = valorFixoProduto * (quantidadeAtual + 1);
  $('#produtoValor').text(novoValor.toFixed(2));
  $('#produtoQuantidade').text(quantidadeAtual + 1);
  $("#subtracao").show();
});

$(document).on('click', '#subtracao', ev => {
  let quantidadeAtual = parseInt($('#produtoQuantidade').text());

  if (quantidadeAtual > 1) {
      quantidadeAtual--
      const novoValor = valorFixoProduto * quantidadeAtual;
      $('#produtoValor').text(novoValor.toFixed(2));
      $('#produtoQuantidade').text(quantidadeAtual);
  }
  if (quantidadeAtual <= 1) {
      $("#subtracao").hide();
  }
});