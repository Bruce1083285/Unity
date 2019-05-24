
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";


/**
 * @class 保护罩
 */
export class Protection extends PropUseing {

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
        GameManage.Instance.StopTargetAction(role);

        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                role.addChild(prop);
                prop.scale = 3;
                prop.setPosition(0, 0);
                break;
            }
        }

        let type_Class = null;
        let name = role.name;
        if (name === "AI") {
            type_Class = role.getComponent(AI);
        } else if (name === "Player") {
            type_Class = role.getComponent(Player);
        }
        //保护罩开启
        type_Class.IsOpen_Pretection = true;

        let callback = () => {
            GameManage.Instance.StopTargetAction(role);

            type_Class.IsOpen_Pretection = false;
            prop.destroy();
        }

        setTimeout(callback, 5000);
        console.log("道具------------------>保护罩");
    }

}
