import EventCenter from "./commont/EventCenter";
import { EventType } from "./commont/Enum";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    /**
     * @property 首页
     */
    private Panel_Start: cc.Node = null;

    onLoad() {
        this.Init();
    }

    start() {
    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Panel_Start = this.node.getChildByName("Panel_Start");

        this.PanelShow(this.Panel_Start);
    }

    /**
     * 板块显示
     * @param panel_node 板块节点
     */
    private PanelShow(panel_node: cc.Node) {
        panel_node.active = true;
    }
}
