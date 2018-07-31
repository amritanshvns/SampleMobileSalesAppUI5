sap.ui.define([
    'technophilia/MobileSalesApp/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'technophilia/MobileSalesApp/model/formatter'
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    return BaseController.extend("technophilia.MobileSalesApp.controller.AdminContent", {

        formatter: formatter,

        onInit: function () {
            var oViewModel = new JSONModel({
                isPhone : Device.system.phone
            });
            this.setModel(oViewModel, "view");
            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
        }
    });
});