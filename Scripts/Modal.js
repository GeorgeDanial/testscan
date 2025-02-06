
var Modals = {
    Notify: function (msg, okCallBack) {
        modal = $("#NotifyModal");
        if (modal) {
            if (msg) { modal.find("#NotifyModal_Msg").html(msg); }

            var OkBtn = modal.find("#NotifyModal_Ok");
            if (OkBtn) {
                OkBtn.unbind('click');
                OkBtn.click(function () {
                    if (okCallBack) { okCallBack(); }
                    modal.modal('hide');
                });
            }

            modal.modal('show');
        }
    },

    Confirm: function (msg, confirmCallBack, cancelCallBack) {

        modal = $("#ConfirmModal");
        if (modal) {
            if (msg) { modal.find("#ConfirmModal_Msg").html(msg); }

            var ConfirmBtn = modal.find("#ConfirmModal_Confirm");
            var CancelBtn = modal.find("#ConfirmModal_Cancel");
            if (ConfirmBtn) {
                ConfirmBtn.unbind('click');
                ConfirmBtn.click(function () {
                    if (confirmCallBack) { confirmCallBack(); }
                    modal.modal('hide');
                });
            }
            if (CancelBtn) {
                CancelBtn.unbind('click');
                CancelBtn.click(function () {
                    if (cancelCallBack) { cancelCallBack(); }
                    modal.modal('hide');
                });
            }

            modal.modal('show');
        }
    }
}




