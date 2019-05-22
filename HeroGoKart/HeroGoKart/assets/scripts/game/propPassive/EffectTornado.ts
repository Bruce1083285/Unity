import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";

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
        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;

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

        let box = role.getChildByName("Box");
        box.stopAllActions();
        box.scale = 1;

        if (role.name === "Player") {
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        // this.Pool_PassiveProp.put(prop);
        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        let speed_value = type_C.Speed;
        type_C.IsSpeedUp = false;
        type_C.Speed = 0;

        GameManage.Instance.IsUseingProp = false;

        let act_Scale_big = cc.scaleTo(0.3, 1.5);
        let act_Rotate = cc.rotateTo(1.5, 1080);
        let act_Scale_small = cc.scaleTo(0.3, 1);
        let act_callback = () => {
            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
            }
            GameManage.Instance.IsUseingProp = true;
            collider.enabled = true;
            if (!type_C.IsSpeedUping) {
                type_C.IsSpeedUp = true;
            }
            type_C.Speed = speed_value;
            role.setPosition(role.position.x, role.position.y + 500);
        }
        let act_Seq = cc.sequence(act_Scale_big, act_Rotate, act_Scale_small, cc.callFunc(act_callback));
        box.runAction(act_Seq);
    }
}
