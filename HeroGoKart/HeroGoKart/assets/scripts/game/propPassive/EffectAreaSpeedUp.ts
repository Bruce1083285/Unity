import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { SoundType, EventType } from "../../commont/Enum";
import { EventCenter } from "../../commont/EventCenter";
import Role from "../Role";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 加速带效果
 */
export class EffectAreaSpeedUp extends PropPassive {

    /**
    * 构造函数
    * @param pool_PassiveProp 被动道具对象池
    */
    constructor(pool_PassiveProp: cc.NodePool, game: Game) {
        super(pool_PassiveProp, game);
    }

    /**
     * 影响效果
     * @param role 角色节点
     * @param prop 道具节点
     */
    public Effect(role: cc.Node, prop: cc.Node) {
        this.SetProp(role, prop);
    }

    /**
      * 设置道具
      * @param role 角色节点
      * @param prop 道具节点
      */
    private SetProp(role: cc.Node, prop: cc.Node) {
        GameManage.Instance.StopTargetAction(role);

        // GameManage.Instance.IsTouchClick = true;
        // GameManage.Instance.StopTargetAction(role);

        EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
        let prop_1: cc.Node = null;
        for (let i = 0; i < this.Game.Pre_InitiativeProp.length; i++) {
            if (this.Game.Pre_InitiativeProp[i].name === "7") {
                prop_1 = cc.instantiate(this.Game.Pre_InitiativeProp[i]);
                role.addChild(prop_1);
                prop_1.scale = 3;
                prop_1.setPosition(0, 400);
                break;
            }
        }

        let speed_Effect = cc.instantiate(this.Game.Pre_SpeedEffects);
        role.addChild(speed_Effect);
        speed_Effect.setPosition(0, 0);
        speed_Effect.scale = 2;
        speed_Effect.zIndex = -1;
        let partic = speed_Effect.getComponent(cc.ParticleSystem);
        partic.resetSystem();

        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        type_C.IsSpeedUp = false;
        type_C.IsSpeedUping = true;
        let speed_Value = type_C.Speed;
        type_C.Speed = 1500;
        let callback = () => {
            GameManage.Instance.StopTargetAction(role);
            
            prop_1.destroy();
            speed_Effect.destroy();
            type_C.IsSpeedUp = true;
            type_C.IsSpeedUping = false;
            type_C.Speed = 1000;
        }
        setTimeout(callback, 2000);
        console.log("道具------------------>加速带");
    }
}
