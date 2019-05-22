import { PropEffect } from "../PropEffect";
import { GameManage } from "../../commont/GameManager";
import Game from "../../Game";

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
        if (role.name === "Player") {
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;
        let dragon = prop.getChildByName("gift").getComponent(dragonBones.ArmatureDisplay);
        dragon.playAnimation("a2", 1);
        setTimeout(() => {
            prop.destroy();
        }, 500);

        let name = role.name;
        let type_Class = null;
        if (name === "AI") {
            type_Class = role.getComponent("AI");
        } else if (name === "Player") {
            type_Class = role.getComponent("Player");
        }

        GameManage.Instance.IsUseingProp=true;

        type_Class.IsSpeedUp = false;
        type_Class.Speed = 0;
        let act_Scale_big = cc.scaleTo(1, 1.5);
        let act_Scale_small = cc.scaleTo(0.3,1);
        let act_callback = () => {
            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
            }

            GameManage.Instance.IsUseingProp=false;

            collider.enabled = true;
            type_Class.IsSpeedUp = true;
            type_Class = 0;
        }
        let act_Seq = cc.sequence(act_Scale_big, act_Scale_small, cc.callFunc(act_callback));
        let box=role.getChildByName("Box");
        box.runAction(act_Seq);
    }
}
