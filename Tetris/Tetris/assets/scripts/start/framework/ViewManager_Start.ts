import { Mode } from "../mode/Mode";

/**
 * @class 视图管理器（UI管理器）
 */
export class ViewManager_Start {

    /**
     * @property 单例
     */
    public static Instance: ViewManager_Start = new ViewManager_Start();
    /**
     * @property 管理--->模式类
     */
    private Manage_Mode: Mode = null;

    /**
     * 私有化构造函数
     */
    private constructor() {
        this.Manage_Mode = new Mode();
    }

    /**
     * 被选中模式显示
     * @param mode 模式父节点
     * @param mode_id 对应模式ID
     */
    public SelectModeShow(mode: cc.Node, mode_id: string) {
        this.Manage_Mode.SelectModeShow(mode, mode_id);
    }
}
