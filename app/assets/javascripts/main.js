!function (a) {
    "use strict";
    /*Mobile menu selected to close menu*/
    $("#bs-example-navbar-collapse-1 ul li").click(function () {
        $("#bs-example-navbar-collapse-1").removeClass("in");
    });

    $("#js-grid-juicy-projects").on('initComplete.cbp', function() {
    	$(".cbp-l-loadMore-button").css({"visibility": "visible", "opacity": "1", "transition-delay": "0s"});
	});


}(this);