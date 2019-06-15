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
        //引导页
        Page_Guide: cc.Node,
        // //提示页
        // Page_Hint: cc.Node,
        // //提示说明
        // Hint_Explain: cc.Node,
        // //礼花粒子效果
        // Hint_Fireworks: cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.SetGuide();
    },

    onEnable() {
        this.initWithData();
    },
    initWithData() {
        HTTP.sendRequest('sign/Looksign', (data) => {
            if (data.status == 0) {
                GameTools.dialog('请求错误', res.msg, null);
                return;
            }
            data = data.data;
            cc.find('content/BT_LQ', this.node).active = (data.sign == 0);
            cc.find('content/Lbl_State', this.node).active = (data.sign != 0);
            this.Day = data.sign == 0 ? (data.day - 1) : data.day;
            let children = cc.find('content/bg_tytk_bai/New Layout', this.node).children;
            for (let i = 0; i < 6; i++) {
                var node = children[i];
                if (i < this.Day) {
                    cc.find('t_qd_yqd', node).active = true;
                } else if (i === this.Day) {
                    let guang = cc.find('t_qd_guang', node);
                    let anima = guang.getComponent(cc.Animation);
                    if (!guang.active) {
                        guang.active = true;
                        anima.play();
                    } else {
                        guang.active = false;
                        anima.stop();
                    }
                } else {
                    cc.find('t_qd_yqd', node).active = false;
                }
            }

        }, { uid: DataHelper.Uid });

    },

    SetGuide() {
        let isNovice = cc.sys.localStorage.getItem("isNovice");
        if (!isNovice) {
            this.Page_Guide.active = true;
        }
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        if (this.Page_Guide.active) {
            this.Page_Guide.active = false;
            // this.Page_Hint.active = true;

            // this.Hint_Explain.scale = 0;
            // let act_scale = cc.scaleTo(0.5, 1);
            // this.Hint_Explain.runAction(act_scale);

            // this.Hint_Fireworks.resetSystem();
        }
        if (data === "hint_close") {
            this.Page_Hint.active = false;
        }
        cc.sys.localStorage.setItem("isNovice", "true");
        HTTP.sendRequest('sign/Getsign', (data) => {
            if (data.status != 1) {
                Dialog.show(data.msg, () => {
                }, 1);
            }
            if (data.status == 1) {
                cc.find('content/BT_LQ', this.node).active = false;
                if (data.data.length == 1) {
                    let item = data.data[0];
                    ViewHelper.showRewardNode(item.type, item.num);
                } else {
                    let item_gem = null;
                    let item_gold = null;
                    if (data.data[0].type == GameConfig.Reward_Type.Gold) {
                        item_gold = data.data[0];
                        item_gem = data.data[1];
                    } else {
                        item_gold = data.data[1];
                        item_gem = data.data[0];
                    }
                    ViewHelper.showRewardNode(item_gem.type, item_gem.num, () => {
                        let num = BigNumber(DataHelper.getOnTimeGold()).times(GameTools.GetRandom(100, 1000));
                        ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, num);
                    });
                }
                this.initWithData();
            }
        }, { uid: DataHelper.Uid, day: this.Day + 1 });
        HandleMgr.sendHandle('Update_Red');
        HandleMgr.sendHandle('Update_Red_1');
    },
    // update (dt) {},
});
