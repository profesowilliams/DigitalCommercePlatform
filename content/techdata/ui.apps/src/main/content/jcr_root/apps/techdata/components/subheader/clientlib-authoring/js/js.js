$(document).on("dialog-ready", function(e) {
  var container = e.target;
    setTimeout(function() {
		$(".coral3-Multifield-item .cmp-childreneditor__item", container).each(function() {
         var linkName = $(this).find(".cmp-childreneditor__linkName").val();
         var linkPath = $(this).find(".cmp-childreneditor__linkPath").val();
         $(this).find(".coral3-Textfield.coral-InputGroup-input").attr("name", linkName);
         $(this).find(".coral3-Textfield.coral-InputGroup-input").val(linkPath);

      });
     }, 200);
});