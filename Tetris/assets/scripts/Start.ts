import { EventType } from "./commont/Enum";
import EventCenter from "./commont/EventCenter";

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
export default class Start extends cc.Component {

    onLoad() {
        EventCenter.AddListenter(EventType.StartShow, () => {
            this.SelfShow(this.node);
        });
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {

    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "begin":
                this.SlefHide(this.node);
                EventCenter.Broadcast(EventType.GameShow);
                break;
            default:
                break;
        }
    }

    /**
     * 显示自身节点
     * @param show_node 显示的节点
     */
    private SelfShow(show_node: cc.Node) {
        show_node.active = true;
    }

    /**
     * 隐藏自身节点
     * @param hide_node 隐藏的节点
     */
    private SlefHide(hide_node: cc.Node) {
        hide_node.active = false;
    }
}
