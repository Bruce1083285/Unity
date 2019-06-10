
cc.Class({
    extends: cc.Component,

    properties: {
        Node_Dian_Friend: cc.Node,
        Node_Dian_Email: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    show() {
        cc.find('content', this.node).x = 720;
        this.node.active = true;
        cc.find('content', this.node).runAction(cc.moveTo(0.2, 0, 0));
        this.Node_Dian_Friend.active = DataHelper.Data_Sync.friend > 0;
        this.Node_Dian_Email.active = DataHelper.Data_Sync.mail > 0;
    },

    hide(callback) {
        cc.find('content', this.node).runAction(cc.sequence(cc.moveTo(0.2, 720, 0), cc.callFunc(() => {
            this.node.active = false;
            if (callback) {
                callback();
            }
        })));
    },

    start() {
        var userInfo = DataHelper.Data_User;
        cc.find('content/bg_ge_tk/head/head', this.node).getComponent('ImageLoader').setImgUrl(userInfo.headimg);
        // cc.find('content/bg_ge_tk/head/head', this.node).getComponent('ImageLoader').setImgUrl('http://xy.zcwx.com:80/head/man/52.jpg');
        cc.find('content/bg_ge_tk/nick', this.node).getComponent(cc.Label).string = userInfo.nick;
        cc.find('content/bg_ge_tk/man', this.node).active = userInfo.sex == '1';
        cc.find('content/bg_ge_tk/woman', this.node).active = userInfo.sex == '2';
        cc.find('content/bg_ge_tk/id', this.node).getComponent(cc.Label).string = 'ID:' + userInfo.uid;
        HandleMgr.addHandle('ValueChanged_DataSync', () => {
            this.Node_Dian_Friend.active = DataHelper.Data_Sync.friend > 0;
            this.Node_Dian_Email.active = DataHelper.Data_Sync.mail > 0;
        });
    },

    onBtnClicked(event, data) {

        switch (event.target.name) {
            case 'USER_BT_COPY':
                // 复制id
                GameTools.webCopyString(DataHelper.Uid + '');
                return;

            case 'USER_BT_CLOSE':
                // 关闭
                this.hide();
                return;

            default:
                break;
        }

        // this.hide(() => {
        ViewHelper.showNodeWithName(data);
        // })
    },
    // update (dt) {},
});
