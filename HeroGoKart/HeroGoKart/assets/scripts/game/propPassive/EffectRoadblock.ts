import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import { GameManage } from "../../commont/GameManager";
import Game from "../../Game";
import { Special_Car } from "../../commont/Enum";

/**
 * @class 路障
 */
export class EffectRoadblock extends PropPassive {
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
        let act_rotate = cc.rotateBy(15, 10000);
        let act_move = cc.moveBy(15, 10000, 10000);
        let act_spa = cc.spawn(act_rotate, act_move);
        let act_callback = () => {
            prop.destroy();
        }
        let car_name = GameManage.Instance.Current_SpecialCar ? GameManage.Instance.Current_SpecialCar.name : null;
        if (car_name && (car_name === Special_Car.Pickup || car_name === Special_Car.CementTruck || car_name === Special_Car.StreetRoller)) {
            return;
        }
        let act_seq = cc.sequence(act_spa, cc.callFunc(act_callback));
        prop.runAction(act_seq);

        let type_C = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        GameManage.Instance.IsTouchClick = false;
        type_C.IsSpeedUp = false;
        let speed_Value = type_C.Speed;
        type_C.Speed = speed_Value * 0.05;

        let callback = () => {
            GameManage.Instance.IsTouchClick = true;
            type_C.Speed = speed_Value;
            type_C.IsSpeedUp = true;
        }
        setTimeout(callback, 500);
    }
}
