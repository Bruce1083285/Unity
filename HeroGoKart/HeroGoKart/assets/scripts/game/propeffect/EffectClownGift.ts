import { PropEffect } from "../PropEffect";
import { GameManage } from "../../commont/GameManager";
import Game from "../../Game";
import { Special_Car } from "../../commont/Enum";
import Role from "../Role";

/**
 * @class 小丑礼包效果
 */
export class EffectClownGift extends PropEffect {

    /**
     * 构造函数
     */
    constructor(game: Game) {
        super(game);
    }

    /**
     * 影响效果
     * @param role 被影响角色
     */
    public Effect(role: cc.Node, prop: cc.Node) {
        this.RunEffect(role, prop);
    }

    /**
     * 执行影响
     * @param role 被影响角色
     */
    private RunEffect(role: cc.Node, prop: cc.Node) {
        GameManage.Instance.StopTargetAction(role);
        prop.getComponent(cc.BoxCollider).enabled = false;

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
            // prop.destroy();
            return;
        }

        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;
        let dragon = prop.getChildByName("gift").getComponent(dragonBones.ArmatureDisplay);
        dragon.playAnimation("a2", 1);
        setTimeout(() => {
            prop.destroy();
        }, 500);

        let name = role.name;
        let type_Class: Role = null;
        if (name === "AI") {
            type_Class = role.getComponent("AI");
        } else if (name === "Player") {
            type_Class = role.getComponent("Player");
            GameManage.Instance.IsUseingProp = false;
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        if (!type_Class.IsSky) {
            type_Class.IsSky = true;
        } else if (type_Class.IsBorder || type_Class.IsSlowDown || type_Class.IsSky || type_Class.IsLightning || type_Class.IsWaterPolo || type_Class.IsFrozen) {
            if (type_Class.IsBorder) {
                type_Class.IsBorder = false;
            }
            if (type_Class.IsSlowDown) {
                type_Class.Horizontal_Sensitivity = 100;
                type_Class.IsSlowDown = false;
            }
            if (type_Class.IsSky) {
                // type_Class.IsSky = false;
            }
            if (type_Class.IsFrozen) {
                role.getChildByName("5").destroy();
                type_Class.IsFrozen = false;
            }
            if (type_Class.IsWaterPolo) {
                role.getChildByName("4").destroy();
                type_Class.IsWaterPolo = false;
            }
            if (type_Class.IsLightning) {
                role.getChildByName("9").destroy();
                type_Class.IsLightning = false;
            }
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_Class.unscheduleAllCallbacks();
        }
        if (type_Class.IsSpeedUping) {
            let magnet = role.getChildByName("8");
            if (magnet) {
                magnet.destroy();
            }
            role.getChildByName("7").destroy();
            role.getChildByName("win").destroy();
            type_Class.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_Class.unscheduleAllCallbacks();
        }
        collider.enabled = false;

        type_Class.IsSpeedUp = false;
        type_Class.Speed = 0;

        let act_Scale_big = cc.scaleTo(1, 1.5);
        let act_Scale_small = cc.scaleTo(0.3, 1);
        let act_callback = () => {

            if (type_Class.IsFrozen) { }


            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
                GameManage.Instance.IsUseingProp = true;
            }

            collider.enabled = true;
            type_Class.IsSky = false;
            type_Class.IsSpeedUp = true;
            GameManage.Instance.StopTargetAction(role);
            console.log("道具------------------>小丑");
            // type_Class.Speed = 0;
        }
        let act_Seq = cc.sequence(act_Scale_big, act_Scale_small, cc.callFunc(act_callback));
        let box = role.getChildByName("Box");
        box.runAction(act_Seq);
    }
}
