import ShopRole from "./shop/ShopRole";
import { EventType } from "../commont/Enum";
import { EventCenter } from "../commont/EventCenter";
import ShopCar from "./shop/ShopCar";

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
export default class Shop extends cc.Component {

    /**
     * @property 商城--->角色类
     */
    private Shop_Role: ShopRole = null;
    /**
     * @property 商城--->汽车类
     */
    private Shop_Car: ShopCar = null;

    /**
     * 初始化
     */
    Init() {
        this.Shop_Role = this.node.getChildByName("Shop_Role").getComponent(ShopRole);
        this.Shop_Car = this.node.getChildByName("Shop_Car").getComponent(ShopCar);

        this.Shop_Role.Init();
        this.Shop_Car.Init();

        this.Show(this.node);
        this.ShopRoleClose(this.Shop_Role);
        this.ShopCarClose(this.Shop_Car);

        this.AddListenter();
    }


    /**
     * 添加监听
     */
    private AddListenter() {
        //商城--->角色
        EventCenter.AddListenter(EventType.ShopShow_Role, () => {
            // this.Show(this.node);
            this.ShopRoleShow(this.Shop_Role);
            EventCenter.Broadcast(EventType.Coin_Amount);
        }, "ShopRole");
        EventCenter.AddListenter(EventType.ShopColse_Role, () => {
            // this.Close(this.node);
            this.ShopRoleClose(this.Shop_Role);
        }, "ShopRole");

        //商城--->汽车
        EventCenter.AddListenter(EventType.ShopShow_Car, () => {
            // this.Show(this.node);
            this.ShopCarShow(this.Shop_Car);
            EventCenter.Broadcast(EventType.Coin_Amount);
        }, "ShopCar");
        EventCenter.AddListenter(EventType.ShopColse_Car, () => {
            // this.Close(this.node);
            this.ShopCarClose(this.Shop_Car);
        }, "ShopCar");
    }

    /**
     * 移除监听
     */
    private RemoveListenter() {
        //商城--->角色
        EventCenter.RemoveListenter(EventType.ShopShow_Role, "ShopRole");
        EventCenter.RemoveListenter(EventType.ShopColse_Role, "ShopRole");

        //商城--->汽车
        EventCenter.RemoveListenter(EventType.ShopShow_Car, "ShopCar");
        EventCenter.RemoveListenter(EventType.ShopColse_Car, "ShopCar");
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

    /**
     * 显示商城--->角色
     * @param shop_role 商城--->角色类
     */
    private ShopRoleShow(shop_role: ShopRole) {
        shop_role.Show();
    }

    /**
     * 关闭商城--->角色
     * @param shop_role 商城--->角色类
     */
    private ShopRoleClose(shop_role: ShopRole) {
        shop_role.Close();
    }

    /**
     * 显示商城--->汽车
     * @param shop_car 商城--->汽车类
     */
    private ShopCarShow(shop_car: ShopCar) {
        shop_car.Show();
    }

    /**
     * 关闭商城--->汽车
     * @param shop_car 商城--->汽车类
     */
    private ShopCarClose(shop_car: ShopCar) {
        shop_car.Close();
    }
}
