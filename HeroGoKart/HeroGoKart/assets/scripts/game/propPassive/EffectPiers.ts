import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import { Special_Car } from "../../commont/Enum";
import Role from "../Role";

/**
 * @class 石墩效果
 */
export class EffectPiers extends PropPassive {

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

        let arr_car = role.getChildByName("Box").getChildByName("SpecialCar").children;
        let car_name: string = null;
        for (let i = 0; i < arr_car.length; i++) {
            let car = arr_car[i];
            if (car.active) {
                car_name = car.name;
                break;
            }
        }
        if (car_name && (car_name === Special_Car.StreetRoller || car_name === Special_Car.CementTruck)) {
            let act_rotate = cc.rotateBy(15, 10000);
            let act_move = cc.moveBy(15, 10000, 10000);
            let act_spa = cc.spawn(act_rotate, act_move);
            let act_callback = () => {
                prop.destroy();
            }
            let act_seq = cc.sequence(act_spa, cc.callFunc(act_callback));
            prop.runAction(act_seq);
            return;
        }


        // GameManage.Instance.IsTouchClick = false;

        let role_type: Role = null;
        if (role.name === "AI") {
            role_type = role.getComponent(AI);
        } else if (role.name === "Player") {
            role_type = role.getComponent(Player);
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        // if (!role_type.IsSlowDown) {
        //     role_type.IsSlowDown = true;
        // } else if (role_type.IsSlowDown || role_type.IsSky || role_type.IsLightning || role_type.IsWaterPolo || role_type.IsFrozen || role_type.IsSpeedUping) {
        //     if (role_type.IsSlowDown) {
        //         role_type.IsSlowDown = false;
        //     }
        //     if (role_type.IsSky) {
        //         role_type.IsSky = false;
        //     }
        //     if (role_type.IsFrozen) {
        //         role.getChildByName("5").destroy();
        //         role_type.IsFrozen = false;
        //     }
        //     if (role_type.IsWaterPolo) {
        //         role.getChildByName("4").destroy();
        //         role_type.IsWaterPolo = false;
        //     }
        //     if (role_type.IsLightning) {
        //         role.getChildByName("9").destroy();
        //         role_type.IsWaterPolo = false;
        //     }
        //     if (role_type.IsSpeedUping) {
        //         role.getChildByName("7").destroy();
        //         role.getChildByName("win").destroy();
        //         role_type.IsSpeedUping = false;
        //     }
        //     GameManage.Instance.StopTargetAction(role);
        //     role.stopAllActions();
        //     role_type.unscheduleAllCallbacks();
        // }
        if (role_type.IsSpeedUping) {
            let speed = role.getChildByName("7");
            if (speed) {
                speed.destroy();
            }
            let win = role.getChildByName("win");
            if (win) {
                win.destroy();
            }
            role_type.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            role_type.unscheduleAllCallbacks();
        }
        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;

        role_type.IsSpeedUp = false;
        let speed_Value = role_type.Speed;
        role_type.Speed = 0;

        role.stopAllActions();
        let act_Move_left = cc.moveBy(0.3, -50, -150);
        let act_Move_right = cc.moveBy(0.3, 50, -150);
        let callback = () => {

            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
                // this.Game.Horizontal = 0;
            }
            if (role.name === "AI") {
                role_type.Move(101);
            }
            // role_type.IsSlowDown = false;
            // GameManage.Instance.IsTouchClick = true;
            collider.enabled = true;
            // role_type.Speed = speed_Value;
            role_type.IsSpeedUp = true;
            GameManage.Instance.StopTargetAction(role);
            console.log("道具------------------>石墩");
        }
        let act_Move: cc.ActionInstant = null;
        let ran = Math.floor(Math.random() * 100);
        if (ran <= 50) {
            act_Move = act_Move_left;
        } else {
            act_Move = act_Move_right;
        }
        let act_seq = cc.sequence(act_Move, cc.callFunc(callback));
        role.runAction(act_seq);
    }
}
