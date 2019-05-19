import { PropPassive } from "../PropPassive";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Player from "../Player";

/**
 * @class 传送门效果
 */
export class EffectPortal extends PropPassive {

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
        let collider = prop.getComponent(cc.BoxCollider);
        collider.enabled = false;
        role.setPosition(role.position.x, role.position.y + 500);
        let dragon = prop.getComponent(dragonBones.ArmatureDisplay);
        dragon.playAnimation("a3", 1);
        if (role.name === "Player") {
            GameManage.Instance.IsPortal = true;
            let player = role.getComponent(Player);
            let speed_value = player.Speed;
            player.IsSpeedUp = false;
            player.Speed = 0;
            let world_pos = role.parent.convertToWorldSpaceAR(role.position);
            let node_pos = player.Camera.parent.convertToNodeSpaceAR(world_pos);
            let act_move = cc.moveTo(0.3, player.Camera.position.x, node_pos.y + 200);
            let callback = () => {
                collider.enabled = true;
                this.Pool_PassiveProp.put(prop);
                GameManage.Instance.IsPortal = false;
                player.IsSpeedUp = true;
                player.Speed = speed_value;
            }
            let act_seq = cc.sequence(act_move, cc.callFunc(callback));
            player.Camera.runAction(act_seq);
        } else {

            let callback = () => {
                collider.enabled = true;
                this.Pool_PassiveProp.put(prop);
            }
            setTimeout(callback, 1000);
        }



    }
}
