
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
import { GameManage } from "../../commont/GameManager";
import Game from "../../Game";
import Animation_Bomb from "../../animation/Animation_Bomb";

/**
 * @class 炸弹
 */
export class Bomb extends PropUseing {

    /**
       * 构造函数
       * @param props [Array]道具预制体
       */
    constructor(props: cc.Prefab[], game: Game) {
        super(props, game);
    }

    /**
     * 道具使用
     * @param role 角色节点
     * @param skin_id 皮肤ID
     */
    public Useing(role: cc.Node, skin_id: string) {
        this.SetProp(role, skin_id);
    }

    private SetProp(role: cc.Node, skin_id: string) {
        let arr_y: cc.Node[] = [];
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            let patch_node = GameManage.Instance.Roles[i];
            if (patch_node.position.y > role.position.y) {
                arr_y.push(patch_node);
            }
        }
        if (arr_y.length <= 0) {
            return;
        }

        let ran = Math.floor(Math.random() * arr_y.length);
        let target: cc.Node = arr_y[ran];

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
        // setTimeout(() => {
        //     box_Collider.enabled = true;
        // }, 100);

        let bomb = prop.getComponent(Animation_Bomb);
        bomb.SetTarget(target);
        console.log("道具------------------>导弹");
        // let callback = () => {
        //     let prop_y = prop.position.y + 10;
        //     prop.setPosition(prop.position.x, prop_y);
        //     let x = target.position.x - prop.position.x;
        //     let y = target.position.y - prop.position.y;
        //     let dirVec = cc.v2(x, y);    // 方向向量
        //     let radian = prop.position.signAngle(dirVec);    // 求弧度
        //     let degree = cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
        //     prop.rotation = -degree;
        // }
        // this.Game.schedule(callback, 0.5);
    }
}
