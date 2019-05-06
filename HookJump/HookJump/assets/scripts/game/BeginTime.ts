import GameAudio from "./GameAudio";
import { SoundType } from "../common/Enum";

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
export default class BeginTime extends cc.Component {

    /**
     * @property 倒计时label
     */
    private Time_Num: cc.Label = null;
    /**
     * @property ReadyGo
     */
    private ReadyGo: cc.Node = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    Init() {
        this.Time_Num = this.node.getChildByName("time_label").getComponent(cc.Label);
        this.ReadyGo = this.node.getChildByName("ReadyGo");
    }

    /**
     * 播放倒计时
     * @param isdeath 是否为死亡
     */
    Play() {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Ready_Go);
        this.node.active = true;
        this.ReadyGo.getChildByName("ready").active = true;
        this.ReadyGo.getChildByName("go").active = true;
        // this.Time_Num.node.active = true;

        // this.TimeCountDown(this.Time_Num);
        this.ReadyGo.active = true;
        this.node.getComponent(cc.Animation).play();
    }

    /**
     * 倒计时
     * @param time_label 计时label
     */
    private TimeCountDown(time_label: cc.Label) {
        let time = 3;
        time_label.string = time + "";
        let callbacks = () => {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Luck_Audio);
            time--;
            time_label.string = time + "";
            if (time <= 0) {
                this.ReadyGo.active = true;
                time_label.node.active = false;
                this.node.getComponent(cc.Animation).play();
                this.unschedule(callbacks);
                return;
            }
        }
        this.schedule(callbacks, 1);
    }

    /**
     * 倒计时结束
     */
    private TimeCountDownOver() {
        this.scheduleOnce(() => {
            this.ReadyGo.getChildByName("go").active = false;
            this.ReadyGo.active = false;
            this.node.active = false;
        }, 0.5);
    }

    /**
     * ready关闭
     */
    private ReadyClose() {
        this.ReadyGo.getChildByName("ready").active = false;
    }

    /**
     * go关闭
     */
    private GoClose() {
       
    }
}
