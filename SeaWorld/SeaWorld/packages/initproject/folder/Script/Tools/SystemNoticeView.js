
cc.Class({
    extends: cc.Component,

    properties: {
        Lbl_Text: cc.Label,
        Node_Msg: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    beginTimer() {
        if (this.timeFn) {
            this.unschedule(this.timeFn);
        }
        this.timeFn = () => {
            if (!this.begin) {
                HTTP.sendRequest('Marquee', { uid: UserMgr.uid }, (data) => {
                    if (data instanceof Array) {
                        this.showTxt(data.join('   '));
                    }
                },0,true);
            }
        };
        this.schedule(this.timeFn, 20);
    },

    showTxt(str) {
        this.begin = true;
        this.Node_Msg.active = true;
        this.Lbl_Text.string = str;
        this.Lbl_Text.node.x = this.Lbl_Text.node.parent.width;
        this.Lbl_Text.node.runAction(cc.sequence(cc.moveTo(10, -this.Lbl_Text.node.width - 100, 0), cc.callFunc(() => {
            this.Node_Msg.active = false;
            this.Lbl_Text.node.x = this.Lbl_Text.node.parent.width;
            this.begin = false;
        })));
    },
    start() {

    },

    // update (dt) {},
});
