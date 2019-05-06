import Http from "../common/Http";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    /**
     * @property 奖品数据
     */
    private Prize_Data: any[] = [];
    /**
     * @property label
     */
    private HorseRaceLamp_Label: cc.Label = null;
    /**
     * @property 下标索引
     */
    private Prize_Index: number = 0;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.GetHttp();
    }

    /**
     * 获取后台数据
     */
    private GetHttp() {
        //获取奖品排行榜
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/reward", (data) => {
            // console.log("跑马灯");
            // console.log(data);
            if (data === null) {
                return;
            }
            this.Prize_Data = data.data;
            if (this.Prize_Data.length <= 0) {
                // console.log("跑马灯return");
                return
            }
            this.HorseRaceLamp_Label = this.node.getChildByName("label").getComponent(cc.Label);
            this.Play();
        });
    }

    /**
     * 是否为空
     * @param str 字符串
     */
    private isEmpty(str: string) {
        if (str == null || str == '' || str == 'null' || str == 'undefine') {
            return true;
        }
        return false;
    }

    /**
     * 更新播放
     */
    Play() {
        if (this.Prize_Data.length <= 0) {
            // console.log("跑马灯return");
            return
        }
        //type：1为奖励榜单
        //type：2为抽奖名单
        let name = "";
        if (this.Prize_Data[this.Prize_Index].type === "2") {
            if (!this.isEmpty(this.Prize_Data[this.Prize_Index].nickname)) {
                name = this.Prize_Data[this.Prize_Index].nickname;
            }
            this.HorseRaceLamp_Label.string = "恭喜 " + name + " 在抽奖中获得" + this.Prize_Data[this.Prize_Index].prize;

            this.Prize_Index++;
            if (this.Prize_Index >= this.Prize_Data.length) {
                this.Prize_Index = 0;
            }
            return;
        }

        // console.log("跑马灯数据");
        // console.log(this.Prize_Data[this.Prize_Index]);
        if (!this.isEmpty(this.Prize_Data[this.Prize_Index].nickname)) {
            name = this.Prize_Data[this.Prize_Index].nickname;
        }
        if (this.Prize_Index === 0) {
            this.HorseRaceLamp_Label.string = "恭喜 " + name + " 在比赛中获得888元现金";
        } else {
            this.HorseRaceLamp_Label.string = "恭喜 " + name + " 在比赛中获得5元话费";
        }

        this.Prize_Index++;
        if (this.Prize_Index >= this.Prize_Data.length) {
            this.Prize_Index = 0;
        }
    }
}
