cc.Class({
    extends: cc.Component,

    properties: {

        contentText: cc.Label,
        btnYes: cc.Button,
        btnNo: cc.Button,
        btnCenter: cc.Button,

        _callBack: null
    },

    show: function (content, callback, mode) {
        if (!this.node || content == null || content == "") {
            return;
        }
        this.node.active = true;
        this.contentText.string = content;
        this._callBack = callback;
        this.btnYes.node.active = false;
        this.btnNo.node.active = false;
        this.btnCenter.node.active = false;
        if (mode == 1) {
            this.btnCenter.node.active = true;
        } else {
            this.btnYes.node.active = true;
            this.btnNo.node.active = true;
        }
    },

    hide: function () {
        this.node.active = false;
    },

    onBtnClicked: function (event,data) {
        HandleMgr.sendHandle('Audio_Click');
        AudioMgr.playWithUrl("button");
        if (this._callBack)
            this._callBack(data);
        this.hide();
    },
});
