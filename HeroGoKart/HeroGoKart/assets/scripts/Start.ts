import { EventType, CacheType } from "./commont/Enum";
import Shop from "./start/Shop";
import { EventCenter } from "./commont/EventCenter";
import { Cache } from "./commont/Cache";

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
        // this.Test();

        this.Shop = this.node.getChildByName("Shop").getComponent(Shop);

        this.Shop.Init();

        this.Show(this.node);
        this.AddListenter();
    }

    /**
     * 测试
     */
    private Test() {
        //测试
        Cache.RemoveCache(CacheType.HaveCommodity_RoleIDs);
        Cache.RemoveCache(CacheType.HaveCommodity_CarIDs);
        Cache.SetCache(CacheType.Coin_Amount, "1000");
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "play":
                this.Play();
                break;
            case "role_shop":
                this.OpenRoleShop();
                break;
            case "car_shop":
                this.OpenCarShop();
                break;
            default:
                break;
        }
    }

    /**
     * 开始游戏
     */
    private Play() {
        //进入关卡页
        this.Close(this.node);
        EventCenter.Broadcast(EventType.Page_LevelShow);
    }

    /**
     * 开启商城--->角色
     */
    private OpenRoleShop() {
        EventCenter.Broadcast(EventType.ShopShow_Role);
    }

    /**
     * 开启商城--->汽车
     */
    private OpenCarShop() {
        EventCenter.Broadcast(EventType.ShopShow_Car);
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        //显示
        EventCenter.AddListenter(EventType.Page_StartShow, () => {
            this.Show(this.node);
        }, "Start");

        //关闭
        EventCenter.AddListenter(EventType.Page_StartClose, () => {
            this.Close(this.node);
        }, "Start");
    }

    /**
     * 添加监听
     */
    private RemoveListenter() {
        //显示
        EventCenter.RemoveListenter(EventType.Page_StartShow, "Start");

        //关闭
        EventCenter.RemoveListenter(EventType.Page_StartClose, "Start");
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
