sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	return Controller.extend("technophilia.MobileSalesApp.controller.BaseController", {
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		onNavTo: function(viewName) {
			this.getRouter().navTo(viewName);
		},
		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("App", {}, true /*no history*/ );
			}
		},
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		}
	});
});