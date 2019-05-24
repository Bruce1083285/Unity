import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";



/**
 * @class 香蕉皮
 */
export class BananaSkin extends PropUseing {

    /**
       * 构造函数
       * @param props [Array]道具预制体
       */
    constructor(props: cc.Prefab[],game: Game) {
        super(props,game);
    }

    /**
     * 道具使用
     * @param role 角色节点
     * @param skin_id 皮肤ID
     */
    public Useing(role: cc.Node, skin_id: string) {
        this.SetProp(role, skin_id);
    }

    /**
     * 设置道具
     * @param role 角色
     * @param pool_prop 道具对象池
     * @param skin_id 皮肤ID
     */
    public SetProp(role: cc.Node, skin_id: string) {
        let prop: cc.Node = null;
        let parent = role.parent;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                parent.addChild(prop);
                prop.setPosition(role.position);
                break;
            }
        }
        let box_Collider = prop.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        let act_Move = cc.moveBy(0.3, 0, -200);
        let callback = () => {
            box_Collider.enabled = true;
        }
        let act_Seq = cc.sequence(act_Move, cc.callFunc(callback));
        prop.runAction(act_Seq);
    }
}
