import { PropPassive } from "../PropPassive";
import Player from "../Player";
import AI from "../AI";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import { Special_Car } from "../../commont/Enum";
import Role from "../Role";

/**
 * @class 大石头效果
 */
export class EffectBoulder extends PropPassive {

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
    public Effect(role: cc.Node, prop?: cc.Node) {
        this.SetProp(role, prop);
    }

    /**
      * 设置道具
      * @param role 角色节点
      * @param prop 道具节点
      */
    private SetProp(role: cc.Node, prop?: cc.Node) {
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

        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        if (!type_C.IsSlowDown) {
            type_C.IsSlowDown = true;
        } else if (type_C.IsBorder || type_C.IsSlowDown || type_C.IsSky || type_C.IsLightning || type_C.IsWaterPolo || type_C.IsFrozen) {
            if (type_C.IsBorder) {
                type_C.IsBorder = false;
            }
            if (type_C.IsSlowDown) {
                type_C.Horizontal_Sensitivity = 100;
                // type_C.IsSlowDown = false;
            }
            if (type_C.IsSky) {
                type_C.IsSky = false;
            }
            if (type_C.IsFrozen) {
                role.getChildByName("5").destroy();
                type_C.IsFrozen = false;
            }
            if (type_C.IsWaterPolo) {
                role.getChildByName("4").destroy();
                type_C.IsWaterPolo = false;
            }
            if (type_C.IsLightning) {
                role.getChildByName("9").destroy();
                type_C.IsLightning = false;
            }
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_C.unscheduleAllCallbacks();
        }
        if (type_C.IsSpeedUping) {
            role.getChildByName("7").destroy();
            role.getChildByName("win").destroy();
            type_C.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_C.unscheduleAllCallbacks();
        }
        type_C.IsSpeedUp = false;
        let speed_Value = type_C.Speed;
        type_C.Speed = speed_Value * 0.3;

        let collider = role.getComponent(cc.BoxCollider);
        // GameManage.Instance.IsTouchClick = false;
        collider.enabled = false;
        let box = role.getChildByName("Box");
        box.scaleX = 1.3;

        let callback_1 = () => {
            // GameManage.Instance.IsTouchClick = true;
            // type_C.Speed = speed_Value;
            type_C.IsSlowDown = true;
            type_C.IsSpeedUp = true;
            box.scaleX = 1;
            GameManage.Instance.StopTargetAction(role);
            console.log("道具------------------>大石头");
        }
        let callback_2 = () => {
            collider.enabled = true;
            type_C.scheduleOnce(callback_1, 3);
        }
        type_C.scheduleOnce(callback_2, 0.7);
    }
}
