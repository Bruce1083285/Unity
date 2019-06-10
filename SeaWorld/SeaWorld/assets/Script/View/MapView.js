// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Lbl_OffLine: cc.Label,
        Lbl_Gold: cc.Label,
        Lbl_Money: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
    },

    onEnable() {
        this.Lbl_Gold.string = GameTools.formatGold(DataHelper.Gold_Num);
        this.Lbl_Money.string = DataHelper.Money_Num;
    },

    onBtnClicked(event, data) {
        switch (event.target.name) {
            case 'BT_CLOSE':
                this.node.active = false;
                break;
            case 'BT_HELP':
                break;
        }
    },
    // update (dt) {},
});
