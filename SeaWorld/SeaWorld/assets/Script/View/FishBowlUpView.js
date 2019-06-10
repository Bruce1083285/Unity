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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        this.initFn(this.node.CustomData, this.node.CustomData.target);
    },

    initFn(data, target) {
        this.Level = data.level;
        this.Floor = data.floor;
        this.NextPrice = data.nextPrice;
        if (target) {
            this.target = target;
        }
        cc.find('content/title/num', this.node).getComponent(cc.Label).string = data.floor;
        cc.find('content/bg_tytk_bai/title', this.node).getComponent(cc.Label).string = '解锁新鱼种';
        cc.find('content/bg_tytk_bai/title', this.node).y = 47;
        cc.loader.loadResDir('Texture/fish/' + this.target.getFishType(data.level + 1), cc.SpriteFrame, (err, frames) => {
            if (err) {
                return;
            }
            cc.find('content/bg_tytk_bai/fish', this.node).active = true;
            cc.find('content/bg_tytk_bai/fish', this.node).getComponent(cc.Sprite).spriteFrame = frames[0];
        });
        cc.find('content/price/New Label', this.node).getComponent(cc.Label).string = GameTools.formatGold(data.nextPrice);
        cc.find('content/BTN_UP', this.node).nextPrice = data.nextPrice;
        cc.find('content/BTN_UP', this.node).setStatus(BigNumber(DataHelper.Gold_Num).gte(data.nextPrice));
        cc.find('content/bg_tytk_bai/curren', this.node).getComponent(cc.Label).string = GameTools.formatGold(DataHelper.getFishBowlInCome());
        let tempLevel = 9 * (this.Floor - 1) + this.Level + 1;
        cc.find('content/bg_tytk_bai/next', this.node).getComponent(cc.Label).string = GameTools.formatGold(DataHelper.getFishBowlInCome(tempLevel));
    },

    onBtnClicked() {
        HTTP.sendRequest('sign/UpdateFishtank', (res) => {
            if (res.status == 0) {
                GameTools.dialog('请求错误', res.msg, null);
                return;
            }
            var data = this.target.toUpLevel(parseInt(res.data.level));
            let tempLevel = 9 * (data.floor - 1) + data.level;

            if (tempLevel % 10 == 0) {
                let nextPrice = BigNumber(data.nextPrice).times(0.8).toString();
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, nextPrice);
            }

            if (data.level == 9) {
                this.node.active = false;
                ViewHelper.setOpenPrice(GameControl.GameData.fishbowls);
                return;
            }

            this.initFn(data);
        }, { uid: DataHelper.Uid, type: GameConfig.Game_Type, level: ++this.Level, floor: this.Floor });
    },

    // update (dt) {},
});
