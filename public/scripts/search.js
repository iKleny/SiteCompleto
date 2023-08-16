//Search
$(document).ready(function() {
    $('#pesquisa').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();
  
        $('.searchable-content').hide().filter(function() {
            return $(this).text().toLowerCase().indexOf(searchTerm) !== -1;
        }).show();
    });
});

