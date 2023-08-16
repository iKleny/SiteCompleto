$(".atualizar").click(ev =>{
    const id = ev.target.id
    console.log(id)
    $("#id").val(id)
})
$(document).ready(function () {
$('#table').DataTable({
    scrollY: '200px',
    scrollCollapse: true,
    paging: false,
});
});