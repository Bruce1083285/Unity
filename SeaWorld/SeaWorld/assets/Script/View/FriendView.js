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
        this.Pool_Item = new cc.NodePool();
        HandleMgr.addHandle('Refresh_FriendList', () => {
            this.bindFriendData();
        }, this);
    },

    onEnable() {
        this.bindFriendData();
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'BT_ADD':
                ViewHelper.showNodeWithName('AddFriendNode');
                break;
            case 'BT_HELP':

                break;
            case 'Btn_Agree':
                this.friendOptions(data, 1);
                break;
            case 'Btn_Refuse':
                this.friendOptions(data, 2);
                break;
            case 'Btn_Zan':
                this.friendOptions(data, 3, event.target);
                break;
            default:
                break;
        }
    },

    friendOptions(uid, type, node) {
        GameTools.loading();
        HTTP.sendRequest('sign/agreeFriend', (res) => {
            GameTools.hidLoading();

            GameTools.toast(res.msg);
            if (type == 3) {
                if (res.status == 1) {
                    this.setImage('Texture/tanchuang/t_hy_dz_1', node);
                    cc.find('zanNum', node.parent).getComponent(cc.Label).string = parseInt(cc.find('zanNum', node.parent).getComponent(cc.Label).string) + 1;
                    node.getComponent(cc.Button).clickEvents = [];
                    ViewHelper.showRewardNode(GameConfig.Reward_Type.Money, 10);
                }
                return;

            }
            this.bindFriendData();
        }, { uid: DataHelper.Uid, fuid: uid, type: type });
    },

    // 清除所有好友节点
    clearChildren() {
        let Content = cc.find('content/bg_tytk_bai/New ScrollView/view/content', this.node);
        let length_h = Content.childrenCount;
        for (let k = 0; k < length_h; k++) {
            let node = Content.children[0];
            this.Pool_Item.put(node);
        }
    },

    // 添加好友数据
    bindFriendData() {
        this.clearChildren();
        GameTools.loading();
        HTTP.sendRequest('sign/Friendslist', (res) => {
            GameTools.hidLoading();
            if (res.status != 1) {
                GameTools.dialog('请求错误', res.msg, null);
                return;
            }
            var friends = res.data;
            for (let i = 0; i < friends.length; i++) {
                const item = friends[i];
                this.getFriendItem((node) => {
                    this.setFriendItemData(node, item);
                    cc.find('content/bg_tytk_bai/New ScrollView/view/content', this.node).addChild(node);
                });
            }
            let temp = DataHelper.Data_Sync;
            temp.friend = 0;
            DataHelper.Data_Sync = temp;
            cc.find('content/New Layout/count', this.node).getComponent(cc.Label).string = '好友数量：' + friends.length;
        }, { uid: DataHelper.Uid });
    },

    // 获取好友节点
    getFriendItem(callback) {
        if (!this.Pool_Item) {
            this.Pool_Item = new cc.NodePool();
        }
        var node = this.Pool_Item.get();
        if (!node) {
            cc.loader.loadRes('Prefab/FriendItem', cc.Prefab, (err, fab) => {
                if (err) {
                    return;
                }
                node = cc.instantiate(fab);
                callback(node);
            });
        } else {
            callback(node);
        }
    },

    // 绑定好友数据
    setFriendItemData(node, data) {
        cc.find('head/head', node).getComponent('ImageLoader').setImgUrl(data.headimgurl);
        cc.find('nick', node).getComponent(cc.Label).string = data.nickname;
        var dir = 'Texture/tanchuang/' + (data.sex == '2' ? 't_nv' : 't_nan');
        this.setImage(dir, cc.find('sex', node));
        node.uid = data.uid;
        if (data.status == 0) {
            cc.find('zan', node).active = false;
            cc.find('Btns', node).active = true;
            GameTools.addClickEvent(cc.find('Btns/Btn_Agree', node), this.node, 'FriendView', 'onBtnClicked', data.uid);
            GameTools.addClickEvent(cc.find('Btns/Btn_Refuse', node), this.node, 'FriendView', 'onBtnClicked', data.uid);
        } else {
            cc.find('zan', node).active = true;
            cc.find('Btns', node).active = false;
            cc.find('zan/zanNum', node).getComponent(cc.Label).string = data.zanNum;
            var url = 'Texture/tanchuang/t_hy_dz_' + data.isZan;
            this.setImage(url, cc.find('zan/Btn_Zan', node));
            if (!data.isZan) {
                GameTools.addClickEvent(cc.find('zan/Btn_Zan', node), this.node, 'FriendView', 'onBtnClicked', data.uid);
            } else {
                cc.find('zan/Btn_Zan', node).getComponent(cc.Button).clickEvents = [];
            }
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

    onDestroy() {
        HandleMgr.clearHandle(this);
    },
    // update (dt) {},
});
