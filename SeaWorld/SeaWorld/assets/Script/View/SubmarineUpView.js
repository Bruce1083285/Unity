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
        LBL_Title_1: cc.Label,
        LBL_Title_2: cc.Label,
        PGB_Level: cc.ProgressBar,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        this.initFn(Global.GameData.submarine);
    },

    initFn(data) {
        this.Level = data.level;
        this.NextPrice = data.nextPrice;
        cc.find('content/bg_tytk_bai/sd/curren', this.node).getComponent(cc.Label).string = '当前速度：' + data.speed.toFixed(2);
        cc.find('content/bg_tytk_bai/sd/next', this.node).getComponent(cc.Label).string = '+0.01';
        cc.find('content/bg_tytk_bai/count/curren', this.node).getComponent(cc.Label).string = '当前载客量：' + data.count;
        cc.find('content/bg_tytk_bai/count/next', this.node).getComponent(cc.Label).string = '+' + (data.nextCount - data.count);
        cc.find('content/title/level', this.node).getComponent(cc.Label).string = data.level;
        cc.find('content/price/New Label', this.node).getComponent(cc.Label).string = GameTools.formatGold(data.nextPrice);
        cc.find('content/SUBM_BT_UP', this.node).nextPrice = data.nextPrice;
        cc.find('content/SUBM_BT_UP', this.node).setStatus(BigNumber(DataHelper.Gold_Num).gte(data.nextPrice));

        this.NextRewardLevel = parseInt(this.Level / 10) * 10 + 10;

        this.PGB_Level.progress = ((10 - (this.NextRewardLevel - this.Level)) / 10).toFixed(2);

        this.LBL_Title_1.string = '达到' + this.NextRewardLevel + '级奖励';
        this.LBL_Title_2.string = 'x' + this.NextRewardLevel * 10;

    },

    onBtnClicked() {
        HTTP.sendRequest('sign/UpdateSubmarinelevel', (data) => {
            if (data.satus == 0) {
                GameTools.dialog('请求错误', data.msg, null);
                return;
            }
            var data = Global.Submarine.toUpLevel(parseInt(data.data.submarinelevel));
            HandleMgr.sendHandle('refresh_gold');

            if (this.Level < 6) {
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, (this.NextPrice * 0.9).toFixed(0));
            }
            if (this.Level % 10 == 0) {
                let nextPrice = BigNumber(data.nextPrice).times(0.8).toString();
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Money, this.NextRewardLevel * 10, () => {
                    ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, nextPrice);
                });
            }

            this.initFn(data);

        }, { uid: DataHelper.Uid, type: GameConfig.Game_Type, submarinelevel: ++this.Level });
    },

    // update (dt) {},
});
