sap.ui.define(['technophilia/MobileSalesApp/controller/BaseController',
    'sap/m/ResponsivePopover', 'sap/m/ActionSheet', 'sap/m/Button', 'sap/m/NotificationListItem', 'sap/ui/core/CustomData',
    'sap/m/MessageToast'
], function (BaseController,
    ResponsivePopover,
    ActionSheet,
    Button,
    NotificationListItem,
    CustomData,
    MessageToast) {

    "use strict";

    return BaseController.extend("technophilia.MobileSalesApp.controller.AdminHome", {
        _bExpanded: true,

        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter('item');
            var sKey = oItem.getKey();
            // if you click on home, settings or statistics button, call the navTo function
            if ((sKey === "home" || sKey === "worklist" || sKey === "statistics")) {
                // if the device is phone, collaps the navigation side of the app to give more space
                this.getRouter().navTo(sKey);
            } else {
                MessageToast.show(sKey);
            }
        },

        onUserNamePress: function (oEvent) {
            if (this.getView().byId("userMessageActionSheet")) {
                this.getView().byId("userMessageActionSheet").destroy();
            }
            var oBundle = this.getResourceBundle();
            // close message popover
            var oMessagePopover = this.byId("errorMessagePopover");
            if (oMessagePopover && oMessagePopover.isOpen()) {
                oMessagePopover.destroy();
            }
            var fnHandleUserMenuItemPress = function (oEvent) {
                MessageToast.show(oEvent.getSource().getText() + " was pressed");
            };
            var oActionSheet = new ActionSheet(this.getView().createId("userMessageActionSheet"), {
                title: oBundle.getText("userHeaderTitle"),
                showCancelButton: false,
                buttons: [
                    new Button({
                        text: 'Logout',
                        type: sap.m.ButtonType.Transparent,
                        press: fnHandleUserMenuItemPress
                    })
                ],
                afterClose: function () {
                    oActionSheet.destroy();
                }
            });
            // forward compact/cozy style into dialog
            // jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oActionSheet);
            oActionSheet.openBy(oEvent.getSource());
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("AdminHome");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        onNotificationPress: function (oEvent) {
            if (this.getView().byId("notificationMessagePopover")) {
                this.getView().byId("notificationMessagePopover").destroy();
            }
            var oBundle = this.getModel("i18n").getResourceBundle();
            // close message popover
            var oMessagePopover = this.byId("errorMessagePopover");
            if (oMessagePopover && oMessagePopover.isOpen()) {
                oMessagePopover.destroy();
            }
            var oButton = new Button({
                text: oBundle.getText("notificationButtonText"),
                press: function () {
                    MessageToast.show("Show all Notifications was pressed");
                }
            });
            var oNotificationPopover = new ResponsivePopover(this.getView().createId("notificationMessagePopover"), {
                title: oBundle.getText("notificationTitle"),
                contentWidth: "300px",
                endButton: oButton,
                placement: sap.m.PlacementType.Bottom,
                content: {
                    path: 'alerts>/alerts/notifications',
                    factory: this._createNotification
                },
                afterClose: function () {
                    oNotificationPopover.destroy();
                }
            });
            this.byId("AdminHome").addDependent(oNotificationPopover);
            // forward compact/cozy style into dialog
            // jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oNotificationPopover);
            oNotificationPopover.openBy(oEvent.getSource());
        },

        _createNotification: function (sId, oBindingContext) {
            var oBindingObject = oBindingContext.getObject();
            var oNotificationItem = new NotificationListItem({
                title: oBindingObject.title,
                description: oBindingObject.description,
                priority: oBindingObject.priority,
                close: function (oEvent) {
                    var sBindingPath = oEvent.getSource().getCustomData()[0].getValue();
                    var sIndex = sBindingPath.split("/").pop();
                    var aItems = oEvent.getSource().getModel("alerts").getProperty("/alerts/notifications");
                    aItems.splice(sIndex, 1);
                    oEvent.getSource().getModel("alerts").setProperty("/alerts/notifications", aItems);
                    oEvent.getSource().getModel("alerts").updateBindings("/alerts/notifications");
                    sap.m.MessageToast.show("Notification has been deleted.");
                },
                datetime: oBindingObject.date,
                authorPicture: oBindingObject.icon,
                press: function () {},
                customData: [
                    new CustomData({
                        key: "path",
                        value: oBindingContext.getPath()
                    })
                ]
            });
            return oNotificationItem;
        }
    });
});