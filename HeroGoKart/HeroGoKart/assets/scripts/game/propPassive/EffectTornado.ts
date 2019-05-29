import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";
import { Special_Car } from "../../commont/Enum";

/**
 * @class 龙卷风效果
 */
export class EffectTornado extends PropPassive {

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
        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;

        let arr_car = role.getChildByName("Box").getChildByName("SpecialCar").children;
        let car_name: string = null;
        for (let i = 0; i < arr_car.length; i++) {
            let car = arr_car[i];
            if (car.active) {
                car_name = car.name;
                break;
            }
        }
        if (car_name && car_name === Special_Car.StreetRoller) {
            // this.node.destroy();
            let callback = () => {
                collider.enabled = true;
            }
            setTimeout(callback, 1000);
            return;
        }

        let arr = role.children;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === "6") {
                arr[i].destroy();
                let callback = () => {
                    collider.enabled = true;
                }
                setTimeout(callback, 1000);
                return;
            }
        }

        // this.Pool_PassiveProp.put(prop);
        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
            GameManage.Instance.IsUseingProp = false;
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        let speed_value = type_C.Speed;
        if (!type_C.IsSky) {
            type_C.IsSky = true;
        } else if (type_C.IsBorder||type_C.IsSlowDown || type_C.IsSky || type_C.IsLightning || type_C.IsWaterPolo || type_C.IsFrozen) {
            if (type_C.IsBorder) {
                type_C.IsBorder = false;
            }
            if (type_C.IsSlowDown) {
                type_C.Horizontal_Sensitivity = 100;
                type_C.IsSlowDown = false;
            }
            if (type_C.IsSky) {
                // type_C.IsSky = false;
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
            let magnet = role.getChildByName("8");
            if (magnet) {
                magnet.destroy();
            }
            let speed = role.getChildByName("7");
            if (speed) {
                speed.destroy();
            }
            let win = role.getChildByName("win");
            if (win) {
                win.destroy();
            }
            type_C.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_C.unscheduleAllCallbacks();
        }
        type_C.IsSpeedUp = false;
        type_C.Speed = 0;
        collider.enabled = false;


        let act_Scale_big = cc.scaleTo(0.3, 1.5);
        let act_Rotate = cc.rotateTo(1.5, 1080);
        let act_Scale_small = cc.scaleTo(0.3, 1);
        let act_callback = () => {
            
            collider.enabled = true;
            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
                GameManage.Instance.IsUseingProp = true;
            }
            type_C.IsSky = false;
            type_C.IsSpeedUp = true;
            // type_C.Speed = speed_value;
            role.setPosition(role.position.x, role.position.y + 500);
            GameManage.Instance.StopTargetAction(role);
            console.log("道具------------------>龙卷风");
        }
        let act_Seq = cc.sequence(act_Scale_big, act_Rotate, act_Scale_small, cc.callFunc(act_callback));
        let box = role.getChildByName("Box");
        box.runAction(act_Seq);
    }
}
