sap.ui.define(["technophilia/MobileSalesApp/controller/BaseController",
], function(BaseController) {
	"use strict";

	return BaseController.extend("technophilia.MobileSalesApp.controller.App", {
		onButtonPress : function(oEvent){
			this.onNavTo("ADMIN");
		}
	});
});
