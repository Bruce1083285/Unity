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
        Node_Items: cc.Node,
        Node_Buy: cc.Node,
        // LBL_Bs: [cc.Label],
        LBL_Title: cc.Label,
        LBL_Title1: cc.Label,
        LBL_Price: cc.Label,
        IMG_Icn: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    onEnable() {
        // this.setList();
        this.init();
        // for (let i = 0; i < this.LBL_Bs.length; i++) {
        //     const element = this.LBL_Bs[i];
        //     element._isBold = true;
        // }
    },

    init() {
        this._Titles = [];
        this._Prices = [];
        this._SpriteF = [];
        for (let i = 0; i < this.Node_Items.childrenCount; i++) {
            let node = this.Node_Items.children[i];
            if (i == 4) {
                let num = BigNumber(DataHelper.getOnTimeGold()).times(60 * 60 * 3);
                node.num = num;
                cc.find('New Label', node).getComponent(cc.Label).string = '3小时x' + GameTools.formatGold(num);
            }
            else if (i == 5) {
                let num = BigNumber(DataHelper.getOnTimeGold()).times(60 * 60 * 6);
                node.num = num;
                cc.find('New Label', node).getComponent(cc.Label).string = '6小时x' + GameTools.formatGold(num);
            }
            this._Titles.push(cc.find('New Label', node).getComponent(cc.Label).string);
            this._Prices.push(cc.find('t_sd_jbdk/New Label', node).getComponent(cc.Label).string);
            this._SpriteF.push(cc.find('dj_1', node).getComponent(cc.Sprite).spriteFrame);
            GameTools.addEvent(node, () => {
                this.showBuyNode(i);
            }, 0);
        }
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'BT_CLOSE':
                this.Node_Buy.active = false;
                break;
            case 'BT_BUY':
                this.Action_Buy();
                break;
            default:
                break;
        }
    },

    Action_Buy() {
        HTTP.sendRequest('Hall/store', (res) => {
            if (res.status != 1) {
                GameTools.dialog('请求错误', data.msg, null);
                return;
            }
            var data = res.data;
            if (this.BuyData.id < 4) {
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gem_1 + this.BuyData.id);
            } else if (this.BuyData.id == 6) {
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gem_5, 1, () => {
                    let num = BigNumber(DataHelper.getOnTimeGold()).times(GameTools.GetRandom(100, 1000));
                    ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, num);
                });
            } else {
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, this.BuyData.num);
                // DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).plus(this.BuyData.num).toString());
                // DataHelper.refreshGold();
            }
            DataHelper.setMoneyNum(parseInt(data));
        }, this.BuyData);
    },

    showBuyNode(id) {
        this.BuyData = {};
        this.BuyData.uid = DataHelper.Uid;
        this.BuyData.id = id;
        this.BuyData.cost = this._Prices[id];
        if (id < 4 || id == 6) {
            this.BuyData.gemid = id == 6 ? 5 : (id + 1);
        } else {
            this.BuyData.num = this.Node_Items.children[id].num;
        }
        this.Node_Buy.active = true;
        this.LBL_Title.string = this._Titles[id];
        this.LBL_Title1.string = this._Titles[id];
        this.LBL_Price.string = this._Prices[id] + '购买';
        this.IMG_Icn.spriteFrame = this._SpriteF[id];
    },
    // update (dt) {},
});
