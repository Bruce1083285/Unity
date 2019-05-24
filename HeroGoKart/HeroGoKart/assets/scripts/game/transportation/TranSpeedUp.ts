import { Transportation } from "../Transportation";
import Player from "../Player";
import AI from "../AI";
import { GameManage } from "../../commont/GameManager";
import Game from "../../Game";
import Role from "../Role";

/**
 * @class 空投奖励--->加速卡
 */
export class TranSpeedUp extends Transportation {

    /**
     * 
     * @param game 游戏类
     */
    constructor(game: Game) {
        super(game);
    }


    /**
     * 设置空投
     * @param role 角色节点
     */
    public SetTransportation(role: cc.Node) {
        this.SetSpeedUp(role);
    }

    /**
     * 设置加速卡
     * @param role  角色节点
     */
    private SetSpeedUp(role: cc.Node) {
        // GameManage.Instance.StopTargetAction(role);

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

        let role_type: Role = null;
        if (role.name === "AI") {
            role_type = role.getComponent(AI);
        }
        if (role.name === "Player") {
            role_type = role.getComponent(Player);
        }
        if (!role_type.IsSpeedUping) {
            role_type.IsSpeedUping = true;
        } else {
            let arr = role.children;
            for (let i = 0; i < arr.length; i++) {
                let speed_icon = arr[i];
                if ((speed_icon.name === "7" && speed_icon.uuid !== prop_1.uuid) || (speed_icon.name === "win" && speed_icon.uuid !== speed_Effect.uuid)) {
                    speed_icon.destroy();
                }
            }
            // role.getChildByName("7").destroy();
            // role.getChildByName("win").destroy();
            // role_type.IsSpeedUping = false;
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            role_type.unscheduleAllCallbacks();
        }
        let speed_value = role_type.Speed;
        role_type.IsSpeedUp = false;
        role_type.Speed = 1500;
        let callback = () => {
            // GameManage.Instance.StopTargetAction(role);

            prop_1.destroy();
            speed_Effect.destroy();
            role_type.IsSpeedUp = true;
            role_type.IsSpeedUping = false;
            role_type.Speed = 1000;
            GameManage.Instance.Current_SpecialCar = null;
        }
        setTimeout(callback, 10000);
        console.log("道具------------------>空投加速卡");
    }
}
