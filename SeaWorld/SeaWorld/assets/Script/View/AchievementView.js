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

        /**
         * @property 成就内容
         */
        AchievementContent: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Init();
    },

    start() {

    },

    // update (dt) {},

    /**
     * 初始化
     */
    Init() {
        this._task_Types = [
            {
                id: "1",
                name: "鱼",
                task: 10,
                maxCount: 90,
                award: 100,
            },
            {
                id: "2",
                name: "潜艇",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "3",
                name: "传送带",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "4",
                name: "女仆",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "5",
                name: "萝莉",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "6",
                name: "医生",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "7",
                name: "公主",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "8",
                name: "教师",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "9",
                name: "旅行者",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "10",
                name: "老爷爷",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "11",
                name: "图集",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "12",
                name: "探险家",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "13",
                name: "运动员",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "14",
                name: "艺术家",
                task: 10,
                maxCount: 100,
                award: 100,
            },
        ]
        this.Contents = this.AchievementContent.children;

        this.SetContents();
    },

    /**
     * 设置所有内容节点
     */
    SetContents() {
        for (let i = 0; i < this.Contents.length; i++) {
            let content = this.Contents[i];
            for (let j = 0; j < this._task_Types.length; j++) {
                let obj = this._task_Types[j];
                if (obj.id === content.name) {
                    this.SetContentBox(obj, content);
                }
            }
        }
    },

    /**
     * 设置内容盒子
     * @param {*} obj 任务对象
     * @param {cc.Node} box 盒子节点
     */
    SetContentBox(obj, box) {
        console.log("鱼缸数-------------------->");
        console.log(DataHelper.getFishBowlData());
        let pro_bar = box.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        pro_bar.progress = 0;

        let label_num = box.getChildByName("Explain").getChildByName("label_num").getComponent(cc.Label);
        label_num.string = obj.task;
        let label_award = box.getChildByName("Explain").getChildByName("label_award").getComponent(cc.Label);
        label_award.string = obj.award;
    },

    /**
     * 按钮点击
     * @param {*} event 事件信息
     * @param {string} click 点击参数
     */
    ButtonClick(event, click) {
        console.log("点击测试-------------------------------------------------------->");
        console.log(event);
        switch (click) {
            case "close":
                //关闭
                this.Hide();
                break
            default:
                break;
        }
    },

    /**
     * 隐藏节点
     */
    Hide() {
        this.node.active = false;
    },
});
