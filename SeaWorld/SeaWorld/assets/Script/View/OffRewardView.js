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
        Lbl_Gold: cc.Label,
        Lbl_FZ: cc.Label,
        Lbl_MS: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    show(gold, time) {
        this.Gold = gold;
        this.Lbl_Gold.string = GameTools.formatGold(gold);
        this.Lbl_FZ.string = parseInt(time / 60);
        this.Lbl_MS.string = time % 60;
        this.node.active = true;
    },

    onBtnClicked(event) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'BT_Close':
                this.node.active = false;
                break;
            case 'BT_SJ_L':
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, this.Gold);
                this.node.active = false;
                break;
            case 'BT_SJ_R':
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, BigNumber(this.Gold).times(5).toString());
                this.node.active = false;
                break;
            default:
                break;
        }
    },
    // update (dt) {},
});
