


$(function(){
    $('#add').click(function() {
        $('#select1 option:selected').appendTo('#select2');
    });
    $('#remove').click(function() {
        $('#select2 option:selected').appendTo('#select1');
    });
    $('#add_all').click(function() {
        $('#select1 option').appendTo('#select2');
    });
    $('#remove_all').click(function() {
        $('#select2 option').appendTo('#select1');
    });
    $('#select1').dblclick(function(){
        $("option:selected",this).appendTo('#select2');
    });
    $('#select2').dblclick(function(){
        $("option:selected",this).appendTo('#select1');
    });
});