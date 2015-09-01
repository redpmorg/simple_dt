/**
 * Transmit route responsability to modal submit button
 **/
// Add, Edit, Delete Modal
$("#deleteModal, #addeditModal").on("show.bs.modal", function(event) {

	var parentButton = $(event.relatedTarget);
	var parentHref = parentButton.data("route");

	if(parentButton.hasClass('addDataButton')) {
		var editTextOld = $("#modal-addedit-header").text();
		var editTextNew = editTextOld.replace(/(Editer)/, 'Ajouter');
		$("#modal-addedit-header").text(editTextNew);
	}

	if(parentButton.hasClass("deleteDataButton")) {
		$("#modalDeleteButton").data("route", parentHref);
	}
	if(parentButton.hasClass("editDataButton")) {
		var editTextOld = $("#modal-addedit-header").text();
		var editTextNew = editTextOld.replace(/(Ajouter)/, 'Editer');
		$("#modal-addedit-header").text(editTextNew);

		var oldRoute = parentHref;
		var fetichingRoute = oldRoute.replace(/(addedit)/, 'fetchData');
		$.ajax({
			method: "POST",
			url: fetichingRoute,
		}).done(function(data){
			var dataFetched = JSON.parse(data);
			var form = $("#addeditForm");
			$("input, select, texarea", form).each(function(){
				$this = $(this);
				var name = $this.attr('name');
				var matches = name.match(/\[(.*?)\]/);
				if(dataFetched[matches[1]]){
					$this.val(dataFetched[matches[1]]);
				}
			});
		});
		$(".submit-button").data("route", parentHref);
	}
	if(parentButton.hasClass("addDataButton")) {
		$(".submit-button").data("route", parentHref);
	}
});

//execute modal on click on submit button
$("#modalDeleteButton, .submit-button").on("click", function(){

	var validation = true;
	if($(this).hasClass("submit-button")) {
		validation = validationAction();
	}
	var myAjaxJSON = {
		method: "POST",
		url: $(this).data("route")
	}
	if(validation) {
		if($(this).hasClass("submit-button")) {
			myAjaxJSON = {
				method: "POST",
				url: $(this).data("route"),
				data: $("#addeditForm").serialize()
			}
			$("#addeditModal").modal('hide');
		}
		$.ajax(myAjaxJSON).done(function(data){
			if("" != data){
				$("#nomenclator-title").addClass("hide");
				if("adding..." === data){
					$("#add-message").removeClass("hide");
				}
				if("modifing..." === data){
					$("#modify-message").removeClass("hide");
				}
				if("deleting..." === data){
					$("#delete-message").removeClass("hide");
				}
				setTimeout(function() {
					location.reload();
				}, 500);
			}
		});
	}
});

// Destruct modal on close or dismiss. Clear data and warnings.
$(".modal").on("hidden.bs.modal", function() {
	$("input", this).val("");
	if(tinyMCE.editors.length > 0) {
		tinyMCE.activeEditor.setContent("");
	}
	$(this).removeData();
	$(".validationMessages").remove();
});
