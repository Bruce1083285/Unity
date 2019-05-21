import { PropPassive } from "../game/PropPassive";
import { EffectTimeBomb } from "../game/propPassive/EffectTimeBomb";
import Game from "../Game";
import { GameManage } from "../commont/GameManager";
import { EventCenter } from "../commont/EventCenter";
import { EventType, SoundType, Special_Car } from "../commont/Enum";
import Player from "../game/Player";
import AI from "../game/AI";

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
export default class Animation_TimeBomb extends cc.Component {

    /**
     * @property 游戏类
     */
    private Game: Game = null;
    /**
     * @property 定时炸弹效果
     */
    private Effect_TimeBomb: PropPassive = null;
    /**
     * @property 倒计时
     */
    private Time: cc.Label = null;

    onLoad() {

        this.Init();
    }

    start() {

    }

    update(dt) {
        let arr = this.node.parent.children;
        let special_Car: cc.Node = null;
        for (let i = 0; i < arr.length; i++) {
            let childer = arr[i];
            if (childer.name === "SpecialCar") {
                special_Car = childer;
                break;
            }
        }
        if (special_Car) {
            let arr = special_Car.children;
            for (let i = 0; i < arr.length; i++) {
                let car = arr[i];
                if (car.active && car.name === Special_Car.StreetRoller) {
                    this.unscheduleAllCallbacks();
                    this.node.destroy();
                    return;
                }
            }
        }
    }

    /**
     * 初始化
     */
    Init() {
        this.Game = cc.find("Canvas/Page_Game").getComponent(Game);
        this.Effect_TimeBomb = new EffectTimeBomb(this.Game.Pool_PassiveProps, this.Game);

        this.Time = this.node.getChildByName("time").getComponent(cc.Label);

        this.AddListenter();
        // this.Play();
    }

    /**
     * 播放倒计时
     */
    public Play() {
        this.node.zIndex = 1;
        this.node.getChildByName("time").active = true;
        let num = 20;
        this.Time.string = num + "";
        let callback = () => {
            if (GameManage.Instance.IsPause) {
                return;
            }
            EventCenter.BroadcastOne(EventType.Sound, SoundType.EndTime);
            num--;
            this.Time.string = num + "";
            if (num <= 0) {
                let arr = this.node.parent.children;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].name === "6") {
                        arr[i].destroy();
                        GameManage.Instance.IsTime = false;
                        this.unscheduleAllCallbacks();
                        this.node.destroy();
                        return;
                    }
                }

                EventCenter.BroadcastOne(EventType.Sound, SoundType.TimeBomb);
                GameManage.Instance.IsTime = false;
                this.node.destroy();
                this.Effect_TimeBomb.Effect(this.node.parent, this.node);
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 1);
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        EventCenter.AddListenter(EventType.UnSchedule, () => {
            this.UnSchedule();
        }, "Animation_TimeBomb");
    }

    /**
     * 添加监听
     */
    private RemoveListenter() {
        EventCenter.RemoveListenter(EventType.UnSchedule, "Animation_TimeBomb");
    }



    /**
     * 注销延时回调
     */
    private UnSchedule() {
        this.unscheduleAllCallbacks();
    }
}
