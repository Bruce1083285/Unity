// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.ViewHelper = this;
        this.Tag = 'ViewHelper------------->';
        this.SubView = cc.find('Canvas/SubViews');
        HandleMgr.addHandle('refresh_gold', () => {
            if (this.UpFishBowlNode) {
                cc.find('content/BTN_UP', this.UpFishBowlNode).setStatus(BigNumber(DataHelper.Gold_Num).comparedTo(cc.find('content/BTN_UP', this.UpFishBowlNode).nextPrice) >= 0);
            }
            if (this.UpSubmarineNode) {
                cc.find('content/SUBM_BT_UP', this.UpSubmarineNode).setStatus(BigNumber(DataHelper.Gold_Num).comparedTo(cc.find('content/SUBM_BT_UP', this.UpSubmarineNode).nextPrice) >= 0);
            }
            if (this.UpTransBarNode) {
                cc.find('content/TRANS_BT_UP', this.UpTransBarNode).setStatus(BigNumber(DataHelper.Gold_Num).comparedTo(cc.find('content/TRANS_BT_UP', this.UpTransBarNode).nextPrice) >= 0);
            }
        }, this);
    },

    update(dt) {
        let num = cc.find('Canvas/GameScene/content/BT_OPEN/New Layout/New Label').getComponent(cc.Label).string;
        let price = parseInt(num);
        if (DataHelper.Money_Num >= price) {
            cc.find('Canvas/GameScene/content/BT_OPEN').setStatus(DataHelper.Money_Num >= price);
        }
    },

    showNodeWithName(name, data) {
        if (!this[name]) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/' + name, cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }

                this[name] = cc.instantiate(fab);
                if (data) {
                    this[name].CustomData = data;
                }
                if (name == 'UserInfoNode') {
                    this[name].getComponent('UserInfoView').show();
                }
                this[name].parent = this.SubView;
                this[name].active = true;
                this[name].zIndex = this.getActiveNum();
            });
        } else {
            if (data) {
                this[name].CustomData = data;
            }
            if (name == 'UserInfoNode') {
                this[name].getComponent('UserInfoView').show();
            }
            this[name].active = true;
            this[name].zIndex = this.getActiveNum();
        }
    },

    showRewardNode(type, num, callback) {
        if (!this.RewardNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/LingJiangNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.RewardNode = cc.instantiate(fab);
                this.RewardNode.parent = cc.director.getScene();
                this.RewardNode.active = true;
                this.RewardNode.getComponent('RewardView').showWith(type, num, callback);
            });
        } else {
            this.RewardNode.getComponent('RewardView').showWith(type, num, callback);
        }
    },

    getActiveNum() {
        var num = 0;
        for (let i = 0; i < this.SubView.childrenCount; i++) {
            const node = this.SubView.children[i];
            // if (node.name == 'Toast' ) {
            //     continue;
            // }
            if (node.active)
                num++;
        }
        cc.log('getActiveNum--------->' + num);
        return num;
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {

            case 'GUEST_BT_TRANS':
                // 升级传送带
                ViewHelper.showNodeWithName('UpTransBarNode');
                this.UpGuestNode.active = false;
                break;

            case 'GUEST_BT_GUEST':
                // 升级游客
                ViewHelper.showNodeWithName('UpGuestListNode');
                this.UpGuestNode.active = false;
                break;

            default:
                break;
        }
    },

    // 设置开启新鱼缸位置和价格
    setOpenPrice(fishbowls) {
        var price = 0;
        if (fishbowls.length == 10) {
            return;
        }
        price = GameConfig.UpFishBowlMoney[fishbowls.length - 1];
        if (fishbowls.length > 0) {
            let level = fishbowls[fishbowls.length - 1].level;
            if (level >= 9) {
                cc.find('Canvas/GameScene/content/BT_OPEN').y = GameControl._initOpenBtnY - (GameConfig.HEIGHT_FB - 16) * GameControl.Node_FishBowls.childrenCount;
                cc.find('Canvas/GameScene/content/BT_OPEN').active = true;
            } else {
                cc.find('Canvas/GameScene/content/BT_OPEN').active = false;
            }
        }
        cc.find('Canvas/GameScene/content/BT_OPEN').price = price;
        cc.find('Canvas/GameScene/content/BT_OPEN/New Layout/New Label').getComponent(cc.Label).string = price;
        cc.find('Canvas/GameScene/content/BT_OPEN').setStatus(DataHelper.Money_Num >= price);
    },

    initUpGuestNode() {
        if (!this.UpGuestNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/UpGuestNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.UpGuestNode = cc.instantiate(fab);
                this.UpGuestNode.parent = this.SubView;
                this.UpGuestNode.active = true;
                GameTools.addClickEvent(cc.find('content/bg_tytk_bai/bg_tytk_lanx/GUEST_BT_TRANS', this.UpGuestNode), this.node, 'ViewHelper', 'onBtnClicked');
                GameTools.addClickEvent(cc.find('content/bg_tytk_bai/bg_tytk_lanx/GUEST_BT_GUEST', this.UpGuestNode), this.node, 'ViewHelper', 'onBtnClicked');
            });
        } else {
            this.UpGuestNode.active = true;
        }
    },

    initEmailDetailNode() {
        if (!this.EmailDetailNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/EmailDetailNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.EmailDetailNode = cc.instantiate(fab);
                this.EmailDetailNode.parent = this.node;
                this.EmailDetailNode.active = true;

            });
        } else {
            this.EmailDetailNode.active = true;
        }
    },

    initRankListNode() {
        if (!this.UpTransBarNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/RankListNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.RankListNode = cc.instantiate(fab);
                this.RankListNode.parent = this.node;
                this.RankListNode.active = true;

            });
        } else {
            this.RankListNode.active = true;
        }
    },

    initShuoMingNode() {
        if (!this.ShuoMingNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/ShuoMingNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.ShuoMingNode = cc.instantiate(fab);
                this.ShuoMingNode.parent = this.node;
                this.ShuoMingNode.active = true;

            });
        } else {
            this.ShuoMingNode.active = true;
        }
    },

    initSuiPianNode() {
        if (!this.SuiPianNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/SuiPianNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.SuiPianNode = cc.instantiate(fab);
                this.SuiPianNode.parent = this.node;
                this.SuiPianNode.active = true;

            });
        } else {
            this.SuiPianNode.active = true;
        }
    },

    initAllSuiPianNode() {
        if (!this.AllSuiPianNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/AllSuiPianNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.AllSuiPianNode = cc.instantiate(fab);
                this.AllSuiPianNode.parent = this.node;
                this.AllSuiPianNode.active = true;
                GameTools.addEvent(cc.find('BT_CLOSE', this.AllSuiPianNode), (node) => {
                    this.AllSuiPianNode.active = false;
                });
            });
        } else {
            this.AllSuiPianNode.active = true;
        }
    },

    initTiShengNode() {
        if (!this.TiShengNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/TiShengNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.TiShengNode = cc.instantiate(fab);
                this.TiShengNode.parent = this.node;
                this.TiShengNode.active = true;

            });
        } else {
            this.TiShengNode.active = true;
        }
    },

    initBuyNode() {
        if (!this.BuyNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/BuyNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.BuyNode = cc.instantiate(fab);
                this.BuyNode.parent = this.node;
                this.BuyNode.active = true;

            });
        } else {
            this.BuyNode.active = true;
        }
    },

    setImage(url, node) {
        cc.loader.loadRes(url, cc.SpriteFrame, (err, spritef) => {
            if (err) {
                return;
            }
            node.getComponent(cc.Sprite).spriteFrame = spritef;
        });
    },

    showLingJiangNode(data) {
        var initFn = (data) => {
            cc.find('title', this.LingJiangNode).getComponent(cc.Label).string = data.str;
            let url = '';
            this.setImage(url, cc.find('t_money', this.LingJiangNode));
        };
        if (!this.LingJiangNode) {
            GameTools.loading('加载中');
            cc.loader.loadRes('Prefab/LingJiangNode', cc.Prefab, (err, fab) => {
                GameTools.hidLoading();
                if (err) {
                    return;
                }
                this.LingJiangNode = cc.instantiate(fab);
                this.LingJiangNode.parent = this.node;
                this.LingJiangNode.active = true;
                initFn();
                // 关闭
                cc.find('bg', this.LingJiangNode).on(cc.Node.EventType.TOUCH_START, (event) => {
                    this.LingJiangNode.active = false;
                });
            });
        } else {
            this.LingJiangNode.active = true;
            initFn(data);
        }
    },

    showDialog(title, callback, size) {
        if (!this.Dialog) {
            this.Dialog = cc.find('Canvas/DialogNode').getComponent('DialogView');
        }
        this.Dialog.show(title, callback, size);
    },

    start(data) {

    },

    // update (dt) {},
});
