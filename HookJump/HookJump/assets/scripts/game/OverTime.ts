import Game from "../Game";
import GameAudio from "./GameAudio";
import { SoundType } from "../common/Enum";
import WX from "../common/WX";

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
export default class OverTime extends cc.Component {

    /**
     * @property 倒计时label
     */
    private Time_Num: cc.Label = null;
    /**
     * @property 倒计时值
     */
    private Time_Value: number = 0;
    /**
     * @property 复活按钮
     */
    private But_Resurrection: cc.Button = null;
    /**
     * @property 领取点击开关
     */
    private Receive_Click_Switch: boolean = true;
    /**
     * @property 倒计时开关
     */
    private Time_Switch: boolean = true;
    /**
     * @property 复活次数
     */
    public Resurrection_Count: number = 1;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    Init() {
        this.Time_Num = this.node.getChildByName("time_label").getComponent(cc.Label);
        this.But_Resurrection = this.node.getChildByName("but_Resurrection").getComponent(cc.Button);
    }

    /**
     * 播放倒计时
     * @param isdeath 是否为死亡
     */
    Play() {
        if (this.Resurrection_Count <= 0) {
            this.node.parent.getComponent(Game).GameOver();
            return
        }
        this.node.active = true;
        this.Time_Num.node.active = true;
        this.But_Resurrection.node.active = true;
        this.TimeCountDown(this.Time_Num);
    }

    /**
     * 倒计时
     * @param time_label 计时label
     */
    private TimeCountDown(time_label: cc.Label) {
        this.Time_Value = 10;
        time_label.string = this.Time_Value + "";
        this.Time_Switch = true;
        this.schedule((this.CallBack), 1);
    }

    /**
     * 延时回调
     */
    private CallBack() {
        if (this.Time_Switch) {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Luck_Audio);
            this.Time_Value--;
            this.Time_Num.string = this.Time_Value + "";
            if (this.Time_Value <= 0) {
                this.But_Resurrection.node.active = false;
                this.Time_Num.node.active = false;
                this.node.active = false;
                this.node.parent.getComponent(Game).GameOver();
                this.unschedule(this.CallBack);
                return;
            }
        }
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Click);
        if (this.Receive_Click_Switch) {
            this.Receive_Click_Switch = false;
            this.Time_Switch = false;
            if (WX.IsPlay) {
                cc.audioEngine.pauseAll();
                // WX.Share();
                let istrue = true;
                let callfunc_yes = () => {
                    if (istrue) {
                        this.Resurrection_Count--;
                        this.Time_Num.node.active = false;
                        this.node.active = false;
                        this.node.parent.getComponent(Game).Resurrection();
                        // console.log("复活执行次数");
                        istrue = false;
                        this.unschedule(this.CallBack);
                        cc.audioEngine.resumeAll();
                        this.Receive_Click_Switch = true;
                        this.Time_Switch = false;
                    }
                }
                let callFunc_no = () => {
                    if (istrue) {
                        cc.audioEngine.resumeAll();
                        this.Receive_Click_Switch = true;
                        this.Time_Switch = true;
                        istrue = false;
                    }
                }
                // WX.OnShow(callfunc);
                // WX.RewardedVideoCreator(callfunc_yes, callFunc_no);
                WX.RewardedVideoClose(callfunc_yes, callFunc_no);
            } else {
                let istrue = true;
                let callfunc_yes = () => {
                    // if (istrue) {
                    this.Resurrection_Count--;
                    this.Time_Num.node.active = false;
                    this.node.active = false;
                    this.node.parent.getComponent(Game).Resurrection();
                    // console.log("复活执行次数");
                    // istrue = false;
                    this.unschedule(this.CallBack);
                    cc.audioEngine.resumeAll();
                    this.Receive_Click_Switch = true;
                    this.Time_Switch = false;
                    // }
                }
                let callFunc_no = () => {
                    this.Receive_Click_Switch = true;
                }
                WX.Share(callfunc_yes, callFunc_no);
                // WX.OnShow(callfunc);
            }
        }
    }
}
