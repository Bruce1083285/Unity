import { ModeManager } from "../mode/ModeManager";

/**
 * @class 视图管理器（UI管理器）
 */
export class ViewManager {

    /**
     * @property 单例
     */
    public static Instance: ViewManager = new ViewManager();
    /**
     * @property 模式管理器
     */
    private Manage_Mode: ModeManager = null;

    /**
     * 私有化构造函数
     */
    private constructor() {
        this.Manage_Mode = new ModeManager();
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
