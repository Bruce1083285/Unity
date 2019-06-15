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
        cc.find('content/bg_tytk_bai/New EditBox', this.node).getComponent(cc.EditBox).string = '';
        cc.find('content/bg_tytk_bai/lblhym', this.node).getComponent(cc.Label).string = '我的ID：' + DataHelper.Uid;
    },

    onEnable() {
        cc.find('content/bg_tytk_bai/Friend', this.node).active = false;
        cc.find('content/bg_tytk_bai/New EditBox', this.node).getComponent(cc.EditBox).string = '';
        cc.find('content/bg_tytk_bai/New EditBox', this.node).getComponent(cc.EditBox).placeholder = '请输入好友id';
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'BT_YQ':

                break;

            case 'BT_COPY':
                GameTools.webCopyString(DataHelper.Uid + '');
                break;

            case 'BT_SEARCH':
                var edit = cc.find('content/bg_tytk_bai/New EditBox', this.node).getComponent(cc.EditBox);
                if (edit.string.isEmpty()) {
                    return;
                }
                GameTools.loading();
                HTTP.sendRequest('sign/SearchFriends', (res) => {
                    GameTools.hidLoading();
                    if (res.status != 1) {
                        GameTools.dialog('请求错误', res.msg, null);
                        return;
                    }
                    data = res.data;
                    this.FUID = data.uid;
                    cc.find('content/bg_tytk_bai/Friend/head/head', this.node).getComponent('ImageLoader').setImgUrl(data.headimgurl);
                    cc.find('content/bg_tytk_bai/Friend/nick', this.node).getComponent(cc.Label).string = data.nickname;
                    var dir = 'Texture/tanchuang/' + (data.sex == '2' ? 't_nv' : 't_nan');
                    this.setImage(dir, cc.find('content/bg_tytk_bai/Friend/sex', this.node));
                    cc.find('content/bg_tytk_bai/Friend', this.node).active = true;
                }, { uid: DataHelper.Uid, fuid: edit.string });
                break;
            case 'BT_ADD':
                GameTools.loading();
                HTTP.sendRequest('sign/addFriend', (res) => {
                    GameTools.hidLoading();
                    ViewHelper.showDialog(res.msg, () => {
                        this.node.active = false;
                    }, 46);
                }, { uid: DataHelper.Uid, fuid: this.FUID });
                break;
            default:
                break;
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

    // update (dt) {},
});
