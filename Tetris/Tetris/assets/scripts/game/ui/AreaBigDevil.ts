import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { GameManager } from "../../commont/GameManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**@enum 恶魔动画 */
enum Anima_Devil {
    /**沉睡 */
    chenshui = "chenshui",
    /**待机 */
    daiji = "daiji",
    /**发怒 */
    fanu = "fanu",
    /**攻击 */
    gongji = "gongji",
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class AreaBigDevil extends cc.Component {

    /**
     * @property 恶魔预制体
     */
    @property(cc.Prefab)
    private Pre_Devil: cc.Prefab = null;
    /**
     * @property 目标节点--->AI
     */
    private Target_AI: cc.Node = null;
    /**
     * @property 目标节点--->玩家
     */
    private Target_Player: cc.Node = null;
    /**
     * @property 大恶魔Spine
     */
    private Spine_Devil: sp.Skeleton = null;
    /**
     * @property 倒计时label
     */
    private Bar_Time: cc.ProgressBar = null;
    /**
     * @property AI能量槽
     */
    private BarAttack_AI: cc.ProgressBar = null;
    /**
     * @property 玩家能量槽能量槽
     */
    private BarAttack_Player: cc.ProgressBar = null;
    /**
     * @property 倒计时label
     */
    private Label_Time: cc.Label = null;
    /**
     * @property 是否激活
     */
    private IsActivate: boolean = false;
    /**
     * @property 发怒阀值
     */
    private BurnUpThreshold_Value: number = 0.8;

    onLoad() {
        this.Init();
    }

    update(dt) {
        if (this.BarAttack_AI.progress >= 1) {
            this.ActtackDevil_Player();
            this.BarAttack_AI.progress = 0;
        }
        if (this.BarAttack_Player.progress >= 1) {
            this.ActtackDevil_AI();
            this.BarAttack_Player.progress = 0;
        }
        if (this.BarAttack_AI.progress >= this.BurnUpThreshold_Value && this.Spine_Devil.animation !== Anima_Devil.fanu) {
            this.SetBigDevilStatus(Anima_Devil.fanu);
        }
        if (this.BarAttack_AI.progress < this.BurnUpThreshold_Value && this.Spine_Devil.animation === Anima_Devil.fanu) {
            this.SetBigDevilStatus(Anima_Devil.daiji);
        }
    }

    /**
     * 攻击AI
     */
    private ActtackDevil_AI() {
        //创建恶魔
        let devil = cc.instantiate(this.Pre_Devil);
        let parent = this.node.parent;
        parent.addChild(devil);
        devil.setPosition(this.Target_AI.position.x, this.Target_AI.position.y - 100);
        devil.scale = 0.3;
        devil.getComponent(sp.Skeleton).animation = Anima_Devil.gongji;

        //延时攻击
        let callback = () => {
            devil.destroy();
            EventCenter.BroadcastOne(EventType.SetAIActtackCube, GameManager.Instance.AddUpAttack_Value);
        }
        this.scheduleOnce(callback, 3);
    }

    /**
     * 攻击玩家
     */
    private ActtackDevil_Player() {
        //创建恶魔
        let devil = cc.instantiate(this.Pre_Devil);
        let parent = this.node.parent;
        parent.addChild(devil);
        devil.setPosition(this.Target_Player.position.x, this.Target_Player.position.y - 100);
        devil.getComponent(sp.Skeleton).animation = Anima_Devil.gongji;

        //延时攻击
        let callback = () => {
            devil.destroy();
            EventCenter.BroadcastOne(EventType.SetActtackCube, GameManager.Instance.AIAddUpAttack_Value);
        }
        this.scheduleOnce(callback, 3);
    }

    /**
     * 初始化
     */
    private Init() {
        this.Target_AI = this.node.parent.getChildByName("Area_OtherGame");
        this.Target_Player = this.node.parent.getChildByName("Area_Game");
        this.BarAttack_AI = this.node.getChildByName("BarAttack_Target").getComponent(cc.ProgressBar);
        this.BarAttack_Player = this.node.getChildByName("BarAttack_Self").getComponent(cc.ProgressBar);
        this.Bar_Time = this.node.getChildByName("Time").getChildByName("Bar_Time").getComponent(cc.ProgressBar);
        this.Label_Time = this.node.getChildByName("Time").getChildByName("labe_time").getComponent(cc.Label);
        this.Spine_Devil = this.node.getChildByName("BigDevil").getComponent(sp.Skeleton);

        this.AddListenter();
        this.Time();
        // this.UpdatePlayerBarAttack(50);
    }

    /**
     * 倒计时
     */
    private Time() {
        let time: number = 3;
        let callback = () => {
            time--;
            if (time <= 0) {
                this.UpdateTime();
                this.SetBigDevilStatus(Anima_Devil.chenshui);
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 1);
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //更新AI能量槽
        EventCenter.AddListenter(EventType.UpdateAIBarAttack, (value: number) => {
            this.UpdateAIBarAttack(value);
        }, "AreaBigDevil");

        //更新玩家能量槽
        EventCenter.AddListenter(EventType.UpdatePlayerBarAttack, (value: number) => {
            this.UpdatePlayerBarAttack(value);
        }, "AreaBigDevil");

        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "AreaBigDevil");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //更新AI能量槽
        EventCenter.RemoveListenter(EventType.UpdateAIBarAttack, "AreaBigDevil");

        //更新玩家能量槽
        EventCenter.RemoveListenter(EventType.UpdatePlayerBarAttack, "AreaBigDevil");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "AreaBigDevil");
    }

    /**
     * 更新倒计时
     */
    private UpdateTime() {
        let time: number = 20;
        let str: string = "00:"
        this.Label_Time.string = str + time;
        this.Bar_Time.progress = time / 20;
        let callback = () => {
            time--;
            if (time === 9) {
                str = "00:0";
            }
            this.Label_Time.string = str + time;
            this.Bar_Time.progress = time / 20;


            if (time <= 0) {
                this.IsActivate = true;
                this.SetBigDevilStatus(Anima_Devil.daiji);
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 1);
    }

    /**
     * 更新AI能量槽
     * @param value 能量值
     */
    private UpdateAIBarAttack(value: number) {
        if (!this.IsActivate) {
            return;
        }
        value *= 2
        let percent = value / 100;
        this.BarAttack_AI.progress = percent;
    }

    /**
    * 更新玩家能量槽
    * @param value 能量值
    */
    private UpdatePlayerBarAttack(value: number) {
        if (!this.IsActivate) {
            return;
        }
        value *= 2
        let percent: number = value / 100;
        this.BarAttack_Player.progress = percent;
    }

    /**
     * 设置大恶魔状态
     * @param anima_name 动画名称
     */
    private SetBigDevilStatus(anima_name: Anima_Devil) {
        this.Spine_Devil.animation = anima_name;
    }
}
