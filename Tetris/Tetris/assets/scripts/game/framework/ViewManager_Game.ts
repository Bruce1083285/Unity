import { Popup } from "../ui/Popup";
import AreaStandby from "../ui/AreaStandby";
import AreaGame from "../ui/AreaGame";
import AreaSave from "../ui/AreaSave";
import AreaBigDevil from "../ui/AreaBigDevil";
import PageOver from "./PageOver";

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
    private Manage_AreaStandby: AreaStandby = null;
    /**
     * @property 管理--->游戏区域
     */
    private Manage_AreaGame: AreaGame = null;
    /**
     * @property 管理--->暂存区域
     */
    private Manage_AreaSave: AreaSave = null;
    /**
     * @property 管理--->大恶魔区域
     */
    private Manage_AreaBigDevil: AreaBigDevil = null;
    /**
     * @property 管理--->游戏结束页
     */
    private Manage_PageOver: PageOver = null;


    /**
     * 私有化构造函数
     */
    private constructor() { }

    /**
     * 初始化视图管理器
     * @param arr [Array]脚本节点
     */
    public Init(...arr: cc.Node[]) {
        let i = 0;
        this.Manage_Popup = new Popup();
        this.Manage_AreaStandby = arr[i].getComponent(AreaStandby);
        i++;
        this.Manage_AreaGame = arr[i].getComponent(AreaGame);
        i++;
        this.Manage_AreaSave = arr[i].getComponent(AreaSave);
        i++;
        this.Manage_AreaBigDevil = arr[i].getComponent(AreaBigDevil);
        i++;
        this.Manage_PageOver = arr[i].getComponent(PageOver);
        this.Manage_PageOver.Init();
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
    * @param sprf_standbyCubes 备用方块精灵帧
    */
    public UpdateStandby(sprf_standbyCubes: cc.SpriteFrame[]) {
        this.Manage_AreaStandby.UpdateStandby(sprf_standbyCubes);
    }

    /**
      * 更新游戏开始点
      * @param point_Begin 开始点节点
      * @param pre_Cubes [Array]方块预制体
      * @param cube_ID 方块ID
      */
    public UpdatePointBegin(point_Begin: cc.Node, pre_Cubes: cc.Prefab[], cube_ID: string) {
        this.Manage_AreaGame.UpdatePointBegin(point_Begin, pre_Cubes, cube_ID);
    }

    /**
     * 更新暂存区
     * @param current_Cube 当前方块节点
     */
    public UpdateSave(current_Cube: cc.Node) {
        this.Manage_AreaSave.UpdateSave(current_Cube);
    }


}
