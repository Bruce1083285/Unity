import { Popup } from "../ui/Popup";
import { Standby } from "../ui/Standby";

/**
 * @class 视图管理器
 */
export class ViewManager_Game {

    /**
     * @property 单例
     */
    public static Instance: ViewManager_Game = new ViewManager_Game();
    /**
     * @property 管理--->弹窗
     */
    private Manage_Popup: Popup = null;
    /**
     * @property 管理--->备用方块
     */
    private Manage_Standby: Standby = null;

    /**
     * 私有化构造函数
     */
    private constructor() {
        this.Manage_Popup = new Popup();
        this.Manage_Standby = new Standby();
    }

    /**
     * 设置按钮显示
     * @param but_Set 设置按钮开关
     * @param but_open 开启按钮节点
     * @param but_close 关闭按钮节点
     * @param box 设置面板节点
     */
    public ButSetShow(but_Switchs: cc.Node, but_open: cc.Node, but_close: cc.Node, box: cc.Node) {
        this.Manage_Popup.ButSetShow(but_Switchs, but_open, but_close, box);
    }

    /**
     * 设置按钮隐藏
     * @param but_Switchs 设置按钮开关
     * @param but_open 开启按钮节点
     * @param but_close 关闭按钮节点
     * @param box 设置面板节点
     */
    public ButSetHide(but_Switchs: cc.Node, but_open: cc.Node, but_close: cc.Node, box: cc.Node) {
        this.Manage_Popup.ButSetHide(but_Switchs, but_open, but_close, box);
    }

    /**
    * 更新备用区域方块
    * @param area_Standby 备用方块区域
    * @param sprf_standbyCubes 备用方块精灵帧
    */
    public UpdateStandby(area_Standby: cc.Node, sprf_standbyCubes: cc.SpriteFrame[]) {
        this.Manage_Standby.UpdateStandby(area_Standby, sprf_standbyCubes);
    }
}
