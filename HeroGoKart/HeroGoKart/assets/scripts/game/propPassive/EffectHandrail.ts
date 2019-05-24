import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import { Special_Car } from "../../commont/Enum";
import Role from "../Role";


/**
 * @class 栏杆效果
 */
export class EffectHandrail extends PropPassive {

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

        let act_rotate = cc.rotateBy(15, 10000);
        let act_move = cc.moveBy(15, 10000, 10000);
        let act_spa = cc.spawn(act_rotate, act_move);
        let act_callback = () => {
            prop.destroy();
        }
        let act_seq = cc.sequence(act_spa, cc.callFunc(act_callback));
        prop.runAction(act_seq);

        let arr_car = role.getChildByName("Box").getChildByName("SpecialCar").children;
        let car_name: string = null;
        for (let i = 0; i < arr_car.length; i++) {
            let car = arr_car[i];
            if (car.active) {
                car_name = car.name;
                break;
            }
        }
        if (car_name && (car_name === Special_Car.Pickup || car_name === Special_Car.StreetRoller || car_name === Special_Car.CementTruck)) {
            return;
        }

        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        type_C.IsSpeedUp = false;
        let speed_Value = type_C.Speed;
        type_C.Speed = speed_Value * 0.5;
        if (type_C.IsSpeedUping) {
            role.getChildByName("7").destroy();
            role.getChildByName("win").destroy();
            type_C.IsSpeedUping = false;
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            type_C.unscheduleAllCallbacks();
        }


        let callback = () => {
            GameManage.Instance.StopTargetAction(role);

            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
            }
            // type_C.Speed = speed_Value;
            type_C.IsSpeedUp = true;
            console.log("道具------------------>栏杆");
        }
        type_C.scheduleOnce(callback, 0.5);
    }
}
