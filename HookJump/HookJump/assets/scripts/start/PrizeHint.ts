import Http from "../common/Http";
import WX from "../common/WX";
const sdk = require("../common/sdk")

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
export default class PrizeHint extends cc.Component {

    /**
     * @property 提醒1
     */
    private Hint_1: cc.Node = null;
    /**
     * @property 提醒
     */
    private Hint: cc.Node = null;
    /**
     * @property 用户ID
     */
    private User_ID: any = null;
    /**
     * @property 奖品数据
     */
    private Prize_Data: any[] = [];
    /**
     * @property 领取开关
     */
    private Exchange_Switch: boolean = true;

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Hint_1 = this.node.getChildByName("Hint_1");
        this.Hint = this.node.getChildByName("Hint");

        this.GetHttp();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "hint_close":
                this.node.active = false;
                break;
            case "determine":
                this.Hint_1.active = true;
                break;
            case "hint_1_yes":
                if (this.Exchange_Switch) {
                    this.PlayAdvertisement(5);
                }
                break;
            case "hint_1_no":
                this.Hint_1.active = false;
                break;
            case "exchange_close":
                this.Hint.active = false;
                break;
            case "exchange":
                this.ExchangeHF(5);
                break;
            default:
                break;
        }
    }

    /**
     * 获取后台数据
     */
    private GetHttp() {
        //获取奖品排行榜
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/reward", (data) => {
            // console.log("获取奖品排行数据");
            // console.log(data);
            if (data && data.data.length > 0) {
                this.Prize_Data = data.data;
            } else {
                return;
            }
            this.TestingPrize(this.Prize_Data, WX.Uid, this.node);
        });
    }

    /**
     * 检测奖品
     * @param prize_data 奖品数据
     * @param wx_uid 微信UID
     * @param node 自身节点
     */
    private TestingPrize(prize_data: any[], wx_uid: any, node: cc.Node) {
        // console.log("奖品数据");
        // console.log(prize_data);
        // console.log("微信UID");
        // console.log(typeof (wx_uid));
        for (let i = 0; i < prize_data.length; i++) {
            if (prize_data[i].type === "2") {
                continue;
            }
            if (prize_data[i].uid === wx_uid) {
                if (prize_data[i].status === "1") {
                    this.User_ID = prize_data[i].id;
                    console.log("是否进入");
                    node.active = true;
                    return;
                }
                return;
            }
        }
    }

    /**
    * 播放广告
    * @param exchange_num 兑换值
    */
    private PlayAdvertisement(exchange_num: number) {
        if (WX.IsPlay) {
            cc.audioEngine.pauseAll();
            let istrue = true;
            let callFunc_yes = () => {
                if (istrue) {
                    this.Hint.active = true;
                    // this.Exchange_Num = exchange_num;
                    cc.audioEngine.resumeAll();
                    this.Exchange_Switch = true;
                    this.Hint_1.active = false;
                    istrue = false;
                }
            }
            let callFunc_no = () => {
                cc.audioEngine.resumeAll();
                this.Exchange_Switch = true;
            }
            WX.RewardedVideoClose(callFunc_yes, callFunc_no);
        } else {
            let istrue = true;
            let callFunc_yes = () => {
                // if (istrue) {
                this.Hint.active = true;
                // this.Exchange_Num = exchange_num;
                cc.audioEngine.resumeAll();
                this.Exchange_Switch = true;
                this.Hint_1.active = false;
                // istrue = false;
                // }
            }
            let callback_no = () => {
                this.Exchange_Switch = true;
            }
            WX.Share(callFunc_yes, callback_no);
            // WX.OnShow(callFunc_yes);
        }
    }

    /**
     * 兑换话费
     */
    private ExchangeHF(hf: number) {
        // console.log("用户ID");
        // console.log(this.User_ID);
        //领取奖励
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/Receive", (data) => {
            // console.log("获取奖品排行数据");
            // console.log(data);

        }, { id: this.User_ID });
        if (WX.WX_Swtich) {
            // console.log("兑换值" + this.Exchange_Num);
            sdk.getCardPwd(hf);
        }
        this.Hint.active = false;
        this.node.active = false;
    }
}
