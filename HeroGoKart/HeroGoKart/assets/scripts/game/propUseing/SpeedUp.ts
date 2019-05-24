
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import Role from "../Role";
import { GameManage } from "../../commont/GameManager";


/**
 * @class 加速
 */
export class SpeedUp extends PropUseing {

    /**
     * 构造函数
     * @param props [Array]道具预制体
     */
    constructor(props: cc.Prefab[], game: Game) {
        super(props, game);
    }

    /**
    * 道具使用
    * @param role 角色节点
    * @param skin_id 皮肤ID
    */
    public Useing(role: cc.Node, skin_id: string) {
        this.SetProp(role, skin_id);
    }

    private SetProp(role: cc.Node, skin_id: string) {
        GameManage.Instance.StopTargetAction(role);

        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
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

        let type_Class: Role = null;
        let name = role.name;
        if (name === "AI") {
            type_Class = role.getComponent(AI);
        } else if (name === "Player") {
            type_Class = role.getComponent(Player);
        }
        //加速
        if (!type_Class.IsSpeedUping) {
            type_Class.IsSpeedUping = true;
        } else {
            let arr = role.children;
            for (let i = 0; i < arr.length; i++) {
                let speed_icon = arr[i];
                if ((speed_icon.name === "7" && speed_icon.uuid !== prop.uuid) || (speed_icon.name === "win" && speed_icon.uuid !== speed_Effect.uuid)) {
                    speed_icon.destroy();
                }
            }
            // role.getChildByName("7").destroy();
            // role.getChildByName("win").destroy();
            // type_Class.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_Class.unscheduleAllCallbacks();
        }
        type_Class.IsSpeedUp = false;
        let speed_value = type_Class.Speed;
        type_Class.Speed = 1500;

        role.addChild(prop);
        prop.scale = 3;
        prop.setPosition(0, 400);

        let callback = () => {
            
            type_Class.IsSpeedUp = true;
            type_Class.IsSpeedUping = false;
            type_Class.Speed = 1000;
            GameManage.Instance.StopTargetAction(role);
            speed_Effect.destroy();
            prop.destroy();
            console.log("道具------------------>加速道具");
        }

        type_Class.scheduleOnce(callback, 4);
    }
}
