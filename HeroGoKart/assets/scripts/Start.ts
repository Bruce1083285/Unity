import EventCenter from "./commont/EventCenter";
import { EventType } from "./commont/Enum";
import Shop from "./start/Shop";

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

    /**
     * @property 商城类
     */
    private Shop: Shop = null;

    /**
     * 初始化
     */
    Init() {
        this.Shop = this.node.getChildByName("Shop").getComponent(Shop);

        this.Shop.Init();
        
        this.Show(this.node);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "play":
                this.Close(this.node);
                break;
            case "role_shop":
                EventCenter.Broadcast(EventType.ShopShow_Role);
                break;
            case "car_shop":
                break;
            default:
                break;
        }
    }

    /**
     * 显示节点
     * @param show_node 显示的节点
     */
    private Show(show_node: cc.Node) {
        show_node.active = true;
    }

    /**
     * 关闭节点
     * @param close_node 关闭的节点
     */
    private Close(close_node: cc.Node) {
        close_node.active = false;
    }
}
