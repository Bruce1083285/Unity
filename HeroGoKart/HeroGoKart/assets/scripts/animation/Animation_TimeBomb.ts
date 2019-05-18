import { PropPassive } from "../game/PropPassive";
import { EffectTimeBomb } from "../game/propPassive/EffectTimeBomb";
import Game from "../Game";
import { GameManage } from "../commont/GameManager";

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

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Game = cc.find("Canvas/Page_Game").getComponent(Game);
        this.Effect_TimeBomb = new EffectTimeBomb(this.Game.Pool_PassiveProps, this.Game);

        this.Time = this.node.getChildByName("time").getComponent(cc.Label);
    }

    /**
     * 播放倒计时
     */
    public Play() {
        let num = 30;
        this.Time.string = num + "";
        let callback = () => {
            num--;
            this.Time.string = num + "";
            if (num <= 0) {
                GameManage.Instance.IsTime = false;
                this.Effect_TimeBomb.Effect(this.node.parent, this.node);
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 1);
    }
}
