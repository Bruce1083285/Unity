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
        Spr_JiangLi: cc.Sprite,
        LBL_Num: cc.Label,
        SprF_JiangLi: [cc.SpriteFrame],
        Node_Guang: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    showWith(type, num, callback) {
        HandleMgr.sendHandle('Audio_Award');
        this._Type = type;
        this._Num = num;
        this.callback = callback;
        switch (type) {
            case GameConfig.Reward_Type.Gold:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[0];
                this.Spr_JiangLi.node.scale = 1;
                this.LBL_Num.string = '金币 + ' + GameTools.formatGold(num);
                break;
            case GameConfig.Reward_Type.Money:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[1];
                this.Spr_JiangLi.node.scale = 1;
                this.LBL_Num.string = '现金 + ' + num;
                break;
            case GameConfig.Reward_Type.Gem_1:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[2];
                this.Spr_JiangLi.node.scale = 3;
                this.LBL_Num.string = '1倍宝石x1';
                break;
            case GameConfig.Reward_Type.Gem_2:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[3];
                this.Spr_JiangLi.node.scale = 3;
                this.LBL_Num.string = '2倍宝石x1';
                break;
            case GameConfig.Reward_Type.Gem_3:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[4];
                this.Spr_JiangLi.node.scale = 3;
                this.LBL_Num.string = '3倍宝石x1';
                break;
            case GameConfig.Reward_Type.Gem_4:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[5];
                this.Spr_JiangLi.node.scale = 3;
                this.LBL_Num.string = '4倍宝石x1';
                break;
            case GameConfig.Reward_Type.Gem_5:
                this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[6];
                this.Spr_JiangLi.node.scale = 3;
                this.LBL_Num.string = '10倍宝石x1';
                break;
            case GameConfig.Reward_Type.Bone:
                this.Spr_JiangLi.node.active = false;
                let a = num.split('-');
                let name = 'Texture/suipian/sp_' + a[0] + '_' + a[1];
                cc.log('鱼骨----->' + name);
                cc.loader.loadRes(name, cc.SpriteFrame, (err, frame) => {
                    if (err) {
                        return;
                    }
                    this.Spr_JiangLi.spriteFrame = frame;
                    this.Spr_JiangLi.node.active = true;
                });
                this.Spr_JiangLi.node.scale = 1;
                this.LBL_Num.string = '恭喜获得碎片';
                // this.Spr_JiangLi.spriteFrame = this.SprF_JiangLi[6];
                // this.Spr_JiangLi.node.scale = 3;
                // this.LBL_Num.string = '5倍宝石x1';
                break;
            default:
                break;
        }

        this.node.active = true;
        this.Node_Guang.runAction(cc.repeatForever(cc.rotateBy(3, 360)));
    },

    onClicked() {
        HandleMgr.sendHandle('Audio_Click');
        switch (this._Type) {
            case GameConfig.Reward_Type.Gold:
                DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).plus(this._Num).toString());
                DataHelper.refreshGold();
                break;
            case GameConfig.Reward_Type.Money:
                DataHelper.setMoneyNum(DataHelper.Money_Num + parseInt(this._Num));
                break;
            default:
                break;
        }
        this.Node_Guang.stopAllActions();
        this.node.active = false;
        if (this.callback) {
            this.callback();
        }
    },

    start() {

    },

    // update (dt) {},
});
