import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";

/**
 * @class 龙卷风效果
 */
export class EffectTornado extends PropPassive {

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
        // this.Pool_PassiveProp.put(prop);
        let type_C = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        type_C.IsSpeedUp = false;
        type_C.Speed = 0;

        let act_Scale_big = cc.scaleTo(0.3, 0.6);
        let act_Rotate = cc.rotateTo(3, 1080);
        let act_Scale_small = cc.scaleTo(0.3, 0.4);
        let act_callback = () => {
            type_C.IsSpeedUp = true;
            type_C.Speed = 0;
        }
        let act_Seq = cc.sequence(act_Scale_big, act_Rotate, act_Scale_small, cc.callFunc(act_callback));
        role.runAction(act_Seq);
    }
}
