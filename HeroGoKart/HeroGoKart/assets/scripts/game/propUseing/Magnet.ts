
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
/**
 * @class 吸铁石
 */
export class Magnet extends PropUseing {

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
        skin_id = "7"
        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                role.addChild(prop);
                prop.scale = 3;
                prop.setPosition(0, 400);
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

        let target: cc.Node = null;
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            let ran = Math.floor(Math.random() * GameManage.Instance.Roles.length);
            target = GameManage.Instance.Roles[ran];
            if (target.position.y > role.position.y) {
                break;
            } else {
                i--;
                target = null;
            }
        }
        if (!target) {
            return;
        }

        let target_Class = null;
        let target_name = target.name;
        if (target_name === "AI") {
            target_Class = target.getComponent(AI);
        } else if (target_name === "Player") {
            target_Class = target.getComponent(Player);
        }
        target_Class.IsSpeedUp = false;
        let target_Speed_value = target_Class.Speed;
        target_Class.Speed = target_Speed_value - target_Speed_value * 0.2;
        let act_fadeOut = cc.fadeOut(0.5);
        let act_fadeIn = cc.fadeIn(0.5);
        let act_seq = cc.sequence(act_fadeOut, act_fadeIn).repeatForever();
        target.runAction(act_seq);

        let role_Class = null;
        let role_name = role.name;
        if (role_name === "AI") {
            role_Class = role.getComponent(AI);
        } else if (role_name === "Player") {
            role_Class = role.getComponent(Player);
        }
        role_Class.IsSpeedUp = false;
        let role_Speed_value = role_Class.Speed;
        role_Class.Speed = role_Speed_value + role_Speed_value * 0.3;

        let callback = () => {
            target.stopAllActions();
            prop.destroy();
            speed_Effect.destroy();

            target_Class.IsSpeedUp = true;
            target_Class.Speed = target_Speed_value;

            role_Class.IsSpeedUp = true;
            role_Class.Speed = role_Speed_value;
        }

        setTimeout(callback, 3000);
    }
}
