// import { Http2SecureServer } from "http2";

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
        /**
         * @property 宝箱
         */
        Box: {
            default: null,
            type: cc.Node,
        },

        /**
         * @property 宝箱背景光
         */
        Lighting: {
            default: null,
            type: cc.Node,
        },

        /**
        * @property 奖励页
        */
        Page_Award: {
            default: null,
            type: cc.Node,
        },

        /**
         * @property 奖励--->现金
         */
        Award_Cash: {
            default: null,
            type: cc.SpriteFrame,
        },

        /**
         * @property 奖励--->宝珠
         */
        Award_Orb: {
            default: null,
            type: cc.SpriteFrame,
        },

        /**
         * @property [Array]碎片数组
         */
        SuiPians: {
            default: [],
            type: [cc.Node],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        /**
         * @property [Array]完成状态
         */
        this.AccomplishStatus = [];
        /**
         * @property 当前碎片图鉴ID
         */
        this.Current_SuiPianID = null;
    },

    loadData() {
        GameTools.loading();
        HTTP.sendRequest('Hall/LookBone', (data) => {
            GameTools.hidLoading();
            if (data.status == 0) {
                return;
            }
            this.initView(data.data);
        }, { uid: DataHelper.Uid });
    },
    initView(data) {
        for (let i = 1; i <= 10; i++) {
            let key = 'bone' + i;
            let value = data[key];
            let array = JSON.parse(value);
            let itemNode = cc.find('content/suipian_' + i, this.node);
            let count = 0;
            for (let j = 0; j < array.length; j++) {
                const element = array[j];
                if (element == 1) {
                    count++;
                    cc.find('sp_' + (j + 1), itemNode).color = cc.color(255, 255, 255);
                } else {
                    cc.find('sp_' + (j + 1), itemNode).color = cc.color(0, 0, 0);
                }
            }
            GameTools.removeEvent(itemNode);
            if (count == 4 && data.award[i - 1] == 0) {
                GameTools.addEvent(itemNode, () => {
                    GameTools.loading();
                    HTTP.sendRequest('Hall/getAward', (data) => {
                        GameTools.hidLoading();
                        if (data.status == 0) {
                            return;
                        }
                        ViewHelper.showRewardNode(GameConfig.Reward_Type.Money, 1000);
                        this.loadData();
                    })
                });
            }
        }
        this.GetGetStatus();
        this.UpDateTreasureBoxStatus();
    },

    close() {
        this.node.active = false;
    },
    start() {

    },

    onEnable() {
        this.loadData();
    },
    // update (dt) {},

    /**
     * 按钮点击
     * @param {any} lv 
     * @param {string} click 点击参数
     */
    ButtonClick(lv, click) {
        HandleMgr.sendHandle('Audio_Click');
        switch (click) {
            case "award":
                this.GetAward(this.Page_Award);
                break;
            case "get":
                this.ClosePageAward(this.Page_Award);
                break;
            default:
                break;
        }
    },

    /**
     * 获取奖励
     * @param {cc.Node} page_Award 奖励页
     */
    GetAward(page_Award) {
        for (let i = 0; i < this.AccomplishStatus.length; i++) {
            let obj = this.AccomplishStatus[i];
            if (obj.isAccomplish) {
                HandleMgr.sendHandle('Audio_Award');
                this.Current_SuiPianID = obj.id;
                console.log("完成对象属性------------------------------------------------------------------------------------------------------");
                console.log(this.Current_SuiPianID);
                this.SetCommonAward(obj, page_Award);
                this.AccomplishStatus[i].isAccomplish = false;
                return;
            }
        }
    },

    /**
     * 设置通用奖励
     * @param {*} obj 奖励对象属性
     * @param {cc.Node} page_Award 奖励页
     */
    SetCommonAward(obj, page_Award) {
        page_Award.active = true;
        let label_explain = page_Award.getChildByName("Award").getChildByName("Title").getChildByName("label_explain").getComponent(cc.Label);
        let label_Num = page_Award.getChildByName("Award").getChildByName("Title").getChildByName("label_Num").getComponent(cc.Label);
        let spr_award = page_Award.getChildByName("Award").getChildByName("Award").getChildByName("award").getComponent(cc.Sprite);

        label_explain.string = "现金+";
        label_Num.string = obj.award;
        spr_award.SpriteFrame = this.Award_Cash;

        let money = parseInt(obj.award);
        DataHelper.setMoneyNum(money);
    },

    /**
     * 设置大奖
     * @param {cc.Node} page_Award 奖励页
     */
    SetBigAward(page_Award) {
        page_Award.active = true;
        let label_explain = page_Award.getChildByName("Award").getChildByName("Title").getChildByName("label_explain").getComponent(cc.Label);
        let label_Num = page_Award.getChildByName("Award").getChildByName("Title").getChildByName("label_Num").getComponent(cc.Label);
        let spr_award = page_Award.getChildByName("Award").getChildByName("Award").getChildByName("award").getComponent(cc.Sprite);

        label_explain.string = "5星宝珠+";
        label_Num.string = 1;
        spr_award.SpriteFrame = this.Award_Orb;
    },

    /**
     * 关闭奖励页
     * @param {cc.Node} page_Award 奖励页
     */
    ClosePageAward(page_Award) {
        page_Award.active = false;

        if (this.Current_SuiPianID === "10") {
            //设置大奖
            this.SetBigAward(this.Page_Award);
            this.Current_SuiPianID = null;
        }

        //更新宝箱状态
        this.UpDateTreasureBoxStatus();
    },

    /**
     * 获取领取状态
     */
    GetGetStatus() {
        for (let i = 0; i < this.SuiPians.length; i++) {
            let child = this.SuiPians[i];
            // console.log("颜色值------------------------1");
            // console.log(child);
            let id = child.name.charAt(child.name.length - 1);
            if (id === "0") {
                id = "10";
            }
            let status = {
                id: null,
                isAccomplish: false,
                award: null,
            }
            status.id = id;
            status.award = (i + 1) * 100;
            // console.log("ID值------------------------1");
            // console.log(id);
            let isAccomplish = this.IsGatherAccomplish(child);
            if (isAccomplish) {
                status.isAccomplish = true;
            } else {
                status.isAccomplish = false;
            }
            // status.isAccomplish = true;
            this.AccomplishStatus.push(status);
        }
        // console.log("完成对象属性------------------------------------------------------------------------------------------------------");
        // console.log(this.AccomplishStatus);
    },

    /**
     * 是否收集成功
     * @param {cc.Node} suipian 碎片节点
     * @returns 是否收集成功
     */
    IsGatherAccomplish(suipian) {
        let arr = suipian.children;
        // console.log("颜色值------------------------2");
        // console.log(arr);
        //获取碎片颜色值
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            if (child.name === "title") {
                continue;
            }
            let color_value = child.color;
            // console.log("颜色值------------------------3");
            // console.log(color_value.b);
            // console.log(color_value.g);
            // console.log(color_value.r);
            if (color_value.b !== 255 || color_value.g !== 255 || color_value.r !== 255) {
                return false;
            }
        }

        return true;
    },

    /**
     * 更新宝箱状态
     */
    UpDateTreasureBoxStatus() {
        let isAccomplish = false;
        //是否有图集收集完成
        for (let i = 0; i < this.AccomplishStatus.length; i++) {
            let obj = this.AccomplishStatus[i];
            if (obj.isAccomplish) {
                isAccomplish = obj.isAccomplish;
                break;
            }
        }

        let anima = this.Lighting.getComponent(cc.Animation);
        let button = this.Box.getComponent(cc.Button);
        if (!isAccomplish) {
            this.Box.color = cc.color(160, 160, 160);
            button.interactable = false;
            this.Lighting.active = false;
            anima.stop();
            return;
        }

        this.Box.color = cc.color(255, 255, 255);
        button.interactable = true;
        this.Lighting.active = true;
        anima.play();
    },
});