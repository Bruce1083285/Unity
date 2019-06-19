
cc.Class({
    extends: cc.Component,

    properties: {
        Node_Dian_Friend: cc.Node,
        Node_Dian_Email: cc.Node,
        USER_BT_SIGN: cc.Node,

        //引导页
        Page_Guide: cc.Node,
        // //新手指引--->1
        // Guide_1: cc.Node,

        _Sign_Data: null,
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

        HandleMgr.addHandle('Update_Red_1', (data) => {
            this.UpdateSignStatus();
        }, this);

        this.SetGuide();
        this.UpdateSignStatus();
    },

    //设置新手引导
    SetGuide() {
        let isNovice = cc.sys.localStorage.getItem("isNovice");
        if (!isNovice) {
            this.Page_Guide.active = true;
        }
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
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

        if (this.Page_Guide.active) {
            this.Page_Guide.active = false;
        }
        // this.hide(() => {
        ViewHelper.showNodeWithName(data);
        // })
    },
    update(dt) {
        // this.UpdateSignStatus();
    },

    UpdateSignStatus() {
        // if (this._Sign_Data && this._Sign_Data.sign === 1 && !red.active) {
        //     console.log("签到是否结束-------------------------------------------------------");
        //     return;
        // }
        HTTP.sendRequest('sign/Looksign', (data) => {
            let red = this.USER_BT_SIGN.getChildByName("dian_red");
            // console.log("签到------------------->用户视图");
            // console.log(data);
            if (data.data.sign === 0 && !red.active) {
                // console.log("是否进入----->1");
                red.active = true;
            }
            if (data.data.sign === 1 && red.active) {
                // console.log("是否进入----->2");
                red.active = false;
            }
            // if (data.data.sign === 0) {
            //     // console.log("是否进入----->1");
            //     red.active = true;
            // }
            // if (data.data.sign === 1) {
            //     // console.log("是否进入----->2");
            //     red.active = false;
            // }
        }, { uid: DataHelper.Uid });
    },
});
