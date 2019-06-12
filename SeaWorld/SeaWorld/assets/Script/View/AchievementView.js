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

        /**
         * @property 提示页
         */
        Page_Hint: cc.Node,
        /**
         * @property 礼花粒子效果
         */
        Fireworks: cc.ParticleSystem,
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
                name: "图集",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "5",
                name: "女仆",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "6",
                name: "萝莉",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "7",
                name: "医生",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "8",
                name: "公主",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "9",
                name: "教师",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "10",
                name: "旅行者",
                task: 10,
                maxCount: 100,
                award: 100,
            },
            {
                id: "11",
                name: "老爷爷",
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
        // console.log("成就数据-----------------------------------");
        // console.log(obj);
        let sum = 0;
        switch (obj.id) {
            case "1":
                sum = this.GetFishBowlData();
                break;
            case "2":
                sum = this.GetSumbarineData();
                break;
            case "3":
                sum = this.GetTransportData();
                break;
            case "4":
                return;
                break
            default:
                sum = this.GetGuestData(obj);
                break;
        }

        if (sum < obj.task) {
            let pro_bar = box.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
            let num = sum / obj.task;
            pro_bar.progress = num;

            let label_num = box.getChildByName("Explain").getChildByName("label_num").getComponent(cc.Label);
            label_num.string = obj.task;
            let label_award = box.getChildByName("Explain").getChildByName("label_award").getComponent(cc.Label);
            label_award.string = obj.award;
        } else {
            console.log("任务目标数据--------------->1");
            HTTP.sendRequest('hall/LookAchievement', (data) => {
                console.log("任务目标数据--------------->2");
                console.log(data);
                this.SetAchievementAward(sum, obj, box, data.data);
            }, { uid: DataHelper.Uid });
        }
    },

    /**
     * 
     * @param {*} obj 
     * @param {cc.Node} box 
     * @param {*} data 
     */
    SetAchievementAward(sum, obj, box, data) {
        let num = 0
        let task_Count = 0;
        switch (obj.id) {
            case "1":
                task_Count = data.fishTaskTarget
                break;
            case "2":
                task_Count = data.submarineTaskLevel
                break;
            case "3":
                task_Count = data.conveyorTaskLevel
                break;
            case "4":
                return;
                break
            default:
                for (let i = 0; i < data.touristTaskLevel.length; i++) {
                    let object = data.touristTaskLevel[i];
                    console.log("后台成就数据------------------->1");
                    console.log(object.touristID);
                    console.log(obj.id);
                    let id = parseInt(obj.id);
                    if (object.touristID === id) {
                        console.log("后台成就数据------------------->2");
                        console.log(object.touristID);
                        console.log(obj.id);
                        task_Count = object.touristTaskLevel;
                        break;
                    }
                }
                break;
        }
        num = (sum - task_Count) / obj.task;
        if (num >= 1) {
            num = 1;
        }
        if (num <= 0) {
            num = 0;
        }

        let pro_bar = box.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        pro_bar.progress = num;

        let label_num = box.getChildByName("Explain").getChildByName("label_num").getComponent(cc.Label);
        let task_target = task_Count + obj.task;
        label_num.string = task_target;
        let label_award = box.getChildByName("Explain").getChildByName("label_award").getComponent(cc.Label);
        label_award.string = task_target * 10;
    },

    /**
     * 获取鱼缸数据
     */
    GetFishBowlData() {
        // console.log("鱼缸数-------------------->");
        // console.log(DataHelper.getFishBowlData());
        let data = DataHelper.getFishBowlData();
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            sum += obj.level;
        }
        // console.log(sum);
        return sum;
    },

    /**
     * 获取潜艇等级数据
     */
    GetSumbarineData() {
        let data = DataHelper.getSubmarineData();
        // console.log("潜艇等级-------------------->");
        // console.log(data);
        return data.level;
    },

    /**
     * 获取传送带等级数据
     */
    GetTransportData() {
        let data = DataHelper.getTransportData();
        // console.log("传送带等级-------------------->");
        // console.log(data);
        return data.level;
    },

    /**
     * 获取游客数据
     */
    GetGuestData(obj) {
        let arr = DataHelper.getGuestData();
        // console.log("游客等级-------------------->");
        // console.log(arr);
        // console.log(arr.length);
        let num = parseInt(obj.id);
        // console.log(num);
        let level = 0;
        if (num - 5 < arr.length) {
            level = arr[num - 5];
        }
        // console.log(level);
        return level;
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
            case "hint_close":
                this.Hide_Hint();
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

    /**
     * 隐藏提示节点
     */
    Hide_Hint() {
        this.Page_Hint.active = false;
    },

    /**
     * 获取奖励
     * @param {string} id 
     */
    GetAward(id) {
        let content = null;
        for (let i = 0; i < this.Contents.length; i++) {
            conten = this.Contents[i];
            if (conten.name = id) {
                break;
            }
        }

        let pro_bar = content.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        if (pro_bar.progress >= 1) {
            this.Page_Hint.active = true;
            this.Fireworks.resetSystem();
            //增加金币

            this.SetContents();
        }
    }
});
