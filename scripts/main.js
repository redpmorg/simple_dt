$(document).ready(function () {
//color picker
$('.celColor').colorpicker();


$('.datetimepicker').datetimepicker({
	language: 'fr',
	pickTime: false
});

$('.datetimepicker1').datetimepicker({
	language: 'fr',
	pickTime: false,

});

$("#selectOpt").change(function () {
	if ($(this).find('option:selected').data('url')) {
		window.location.href = $(this).find('option:selected').data('url');
	}

});

$('#extraction-date-picker').datetimepicker({defaultDate: (new Date()), maxDate: (new Date())});
});
