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
        this.UpLen = 1;
    },

    onEnable() {
        this.UpLen = 1;
        this.initFn(Global.GameData.guest);
    },

    initFn(data) {
        var childrens = cc.find('content/bg_tytk_bai/bg_tytk_lanx', this.node).children;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let node = childrens[i];

            node.type = 1 + i;
            node.level = item;

            cc.find('level', node).getComponent(cc.Label).string = '当前等级:' + item;
            // let price = DataHelper.getGuestPrice_Level(item + 1, i + 1);
            // if (price <= 1000) {
            //     price = parseInt(price);
            // }
            // // price = price < 10 ? 10 : price;
            // // price = parseInt(price);
            // cc.find('GUEST_BT_UP', node).price = price;
            // cc.find('GUEST_BT_UP', node).index = i;
            // // cc.find('level', node).getComponent(cc.Label).string = item + 'x0.004';
            // // let result = Math.floor((item * 0.004) * 1000) / 1000;
            // // cc.find('result', node).getComponent(cc.Label).string = parseFloat(result);

            // cc.find('level', node).getComponent(cc.Label).string = DataHelper.getGuestPrice_MenPiao(item, i + 1);
            // cc.find('result', node).getComponent(cc.Label).string = DataHelper.getGuestPrice_MenPiao(item + 1, i + 1);

            // cc.find('GUEST_BT_UP/New Label', node).getComponent(cc.Label).string = GameTools.formatPrice(price);
            // cc.find('GUEST_BT_UP', node).setStatus(BigNumber(DataHelper.Gold_Num).gte(price));
            GameTools.addClickEvent(cc.find('GUEST_BT_UP', node), this.node, 'GuestListUpView', 'onBtnClicked', JSON.stringify(data));
        }
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'GUEST_BT_UP':
                this.showUpDetail(event.target.parent.level, event.target.parent.type)
                break;
            case 'BT_UP_1':
                this.toUpLevel = this.DetailNode.level + 1;
                this.UpLen = 1;
                cc.find('bg_tytk_bai/level', this.DetailNode).getComponent(cc.Label).string = '等级+1';
                let nextMenPiao1 = DataHelper.getGuestPrice_MenPiao(this.toUpLevel, this.DetailNode.type);
                cc.find('bg_tytk_bai/next', this.DetailNode).getComponent(cc.Label).string = '提升后门票:' + GameTools.formatGold(nextMenPiao1.toString());

                this.userPrice = this.getLevelPrice(0, this.DetailNode.level, this.DetailNode.type, this.toUpLevel - 1);
                cc.find('price/New Label', this.DetailNode).getComponent(cc.Label).string = GameTools.formatGold(this.userPrice.toString());
                cc.find('BT_UP', this.DetailNode).setStatus(BigNumber(DataHelper.Gold_Num).gte(this.userPrice));
                break;
            case 'BT_UP_10':
                this.toUpLevel = this.DetailNode.level + 10;
                this.UpLen = 10;
                cc.find('bg_tytk_bai/level', this.DetailNode).getComponent(cc.Label).string = '等级+10';
                let nextMenPiao10 = DataHelper.getGuestPrice_MenPiao(this.toUpLevel, this.DetailNode.type);
                cc.find('bg_tytk_bai/next', this.DetailNode).getComponent(cc.Label).string = '提升后门票:' + GameTools.formatGold(nextMenPiao10.toString());

                this.userPrice = this.getLevelPrice(0, this.DetailNode.level, this.DetailNode.type, this.toUpLevel - 1);
                cc.find('price/New Label', this.DetailNode).getComponent(cc.Label).string = GameTools.formatGold(this.userPrice.toString());
                cc.find('BT_UP', this.DetailNode).setStatus(BigNumber(DataHelper.Gold_Num).gte(this.userPrice));
                break;
            case 'BT_UP_50':
                this.toUpLevel = this.DetailNode.level + 50;
                this.UpLen = 50;
                cc.find('bg_tytk_bai/level', this.DetailNode).getComponent(cc.Label).string = '等级+50';

                let nextMenPiao50 = DataHelper.getGuestPrice_MenPiao(this.toUpLevel, this.DetailNode.type);
                cc.find('bg_tytk_bai/next', this.DetailNode).getComponent(cc.Label).string = '提升后门票:' + GameTools.formatGold(nextMenPiao50.toString());

                this.userPrice = this.getLevelPrice(0, this.DetailNode.level, this.DetailNode.type, this.toUpLevel - 1);
                cc.find('price/New Label', this.DetailNode).getComponent(cc.Label).string = GameTools.formatGold(this.userPrice.toString());
                cc.find('BT_UP', this.DetailNode).setStatus(BigNumber(DataHelper.Gold_Num).gte(this.userPrice));
                break;
            case 'BT_UP':
                let levels = Global.GameData.guest;
                levels[parseInt(this.DetailNode.type - 1)] = this.toUpLevel;

                GameTools.loading();
                HTTP.sendRequest('sign/Updateguest', (res) => {
                    if (res.satus == 0) {
                        GameTools.dialog('请求错误', res.msg, null);
                        return;
                    }

                    let reward = this.getRewardPrice(this.DetailNode.level, this.toUpLevel);

                    DataHelper.setGuestData(JSON.parse(res.data.guest));
                    DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).minus(this.userPrice).toString());
                    HandleMgr.sendHandle('refresh_gold');
                    if (reward.length == 2) {
                        ViewHelper.showRewardNode(reward[1].type, reward[1].num);
                        // ViewHelper.showRewardNode(reward[0].type, reward[0].num, () => {
                        // });
                    } else if (reward.length == 1) {
                        ViewHelper.showRewardNode(reward[0].type, reward[0].num);
                    }
                    this.initFn(JSON.parse(res.data.guest));
                    this.showUpDetail(this.toUpLevel, this.DetailNode.type, this.UpLen);
                    GameTools.hidLoading();
                }, { uid: DataHelper.Uid, type: GameConfig.Game_Type, content: JSON.stringify(levels) });
                break;
            default:
                break;
        }
        HandleMgr.sendHandle('Update_Achievement');
    },

    showUpDetail(level, type, levelLength) {
        if (!levelLength) {
            levelLength = 1;
        }
        this.DetailNode = cc.find('UpDetail/content', this.node);
        this.DetailNode.level = level;
        this.DetailNode.type = type;
        this.toUpLevel = this.DetailNode.level + levelLength;
        let price = this.getLevelPrice(0, level, type, this.toUpLevel - 1);
        this.userPrice = price;
        cc.find('bg_tytk_bai/level', this.DetailNode).getComponent(cc.Label).string = '等级+' + levelLength;
        cc.find('title/level', this.DetailNode).getComponent(cc.Label).string = level;
        cc.find('title/title/type', this.DetailNode).getComponent(cc.Label).string = type - 1;
        cc.find('bg_tytk_bai/curren', this.DetailNode).getComponent(cc.Label).string = '当前门票:' + GameTools.formatGold(DataHelper.getGuestPrice_MenPiao(level, type));
        cc.find('bg_tytk_bai/next', this.DetailNode).getComponent(cc.Label).string = '提升后门票:' + GameTools.formatGold(DataHelper.getGuestPrice_MenPiao(level + levelLength, type));
        cc.find('price/New Label', this.DetailNode).getComponent(cc.Label).string = GameTools.formatGold(price);
        cc.find('BT_UP', this.DetailNode).setStatus(BigNumber(DataHelper.Gold_Num).gte(price));
        this.DetailNode.parent.active = true;
    },

    getLevelPrice(amount, level, type, endLevel) {
        if (level <= endLevel) {
            let price = DataHelper.getGuestPrice_Level(level, type);
            amount = BigNumber(amount).plus(price);
            return this.getLevelPrice(amount, ++level, type, endLevel);
        } else {
            return amount;
        }
    },

    getRewardPrice(beginLevel, endLevel) {
        let result = [];
        if (beginLevel >= 50) {
            let leve1 = parseInt(this.DetailNode.level / 100);
            let leve2 = parseInt(this.toUpLevel / 100);
            let price = BigNumber(DataHelper.getGuestPrice_Level(leve2 * 100, this.DetailNode.type)).times(0.8).toString();
            if (leve2 - leve1 > 0) {
                result.push({ type: GameConfig.Reward_Type.Money, num: leve2 * 100 });
                result.push({ type: GameConfig.Reward_Type.Gold, num: price });
            }
            return result;
        }
        endLevel = endLevel > 50 ? 50 : endLevel;
        let price = this.getLevelPrice(0, beginLevel, this.DetailNode.type, endLevel - 1).times(0.9);
        result.push({ type: GameConfig.Reward_Type.Gold, num: price.toString() });
        return result;
    },
    // update (dt) {},
});
