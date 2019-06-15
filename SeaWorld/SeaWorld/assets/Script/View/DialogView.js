
cc.Class({
    extends: cc.Component,

    properties: {
        LBL_Content: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    show(text, callback, fontsize) {
        if (callback) {
            this.callBack = callback;
        }
        this.LBL_Content.string = text;
        if (fontsize) {
            this.LBL_Content.fontSize = fontsize;
            this.LBL_Content.lineHeight = fontsize + 4;
        }
        this.node.active = true;
        this.node.zIndex = 100;
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'BT_CLOSE':
                this.node.active = false;
                this.callBack('no');
                break;
            case 'BT_QD':
                this.node.active = false;
                this.callBack('yes');
                break;
            default:
                break;
        }
    },

    // update (dt) {},
});
