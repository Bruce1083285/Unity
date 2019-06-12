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

    onLoad() {
        this.Init();
    },

    start() {

    },

    // update (dt) {},

    Init() {
        //获取开放数据域
        this.OpenDataContext = wx.getOpenDataContext();
        this.SetWxUpdateCache();

        this.ShowWorld();
    },

    /**
    * 设置微信存储
    */
    SetWxUpdateCache() {
        // console.log("最大关卡数：" + max_str);
        console.log("金币金币金币金币金币金币金币金币金币金币金币金币");
        console.log(DataHelper.Gold_Num);
        let num = DataHelper.Gold_Num;
        if (!num) {
            num = 0;
        }
        //设置用户托管数据
        wx.setUserCloudStorage({
            KVDataList: [{ key: 'coin', value: num }],
            success: res => {
                // console.log(res);
                // console.log(res + "成功");
                // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                let openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    update: "update",
                });
            },
            fail: res => {
                console.log(res);
            }
        });
    },

    /**
     * 按钮点击
     * @param {*} event 事件信息
     * @param {string} click 点击参数
     */
    ButtonClick(event, click) {
        switch (click) {
            case "close":
                this.Hide();
                break
            case "friend":
                this.ShowFriends();
                break;
            case "world":
                this.ShowWorld();
                break;
            case "left":
                this.BackPage();
                break;
            case "right":
                this.NextPage();
                break;
            default:
                break;
        }
    },

    /**
     * 隐藏节点
     */
    Hide() {
        this.node.destroy();
    },

    /**
     * 显示世界排行榜
     */
    ShowWorld() {
        this.OpenDataContext.postMessage(
            {
                Ranking: "world",
            }
        );
        // this.Ranking_World.active = true;
        // this.Ranking_Friends.active = false;
    },

    /**
     * 显示世界排行榜
     */
    ShowFriends() {
        this.OpenDataContext.postMessage(
            {
                Ranking: "friends",
            }
        );
        // this.Ranking_World.active = false;
        // this.Ranking_Friends.active = true;
    },

    /**
     * 上一页
     */
    BackPage() {
        this.OpenDataContext.postMessage(
            {
                Direction: "left",
            }
        );
    },

    /**
     * 上一页
     */
    NextPage() {
        this.OpenDataContext.postMessage(
            {
                Direction: "right",
            }
        );
    },
});
