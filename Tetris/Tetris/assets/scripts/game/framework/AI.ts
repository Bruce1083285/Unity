import AreaAIGame from "../AI/AreaAIGame";
import AreaAIStandby from "../AI/AreaAIStandby";

/**
 * @class AI
 */
export class AI {

    /**
     * @property 单例
     */
    public static Instance: AI = new AI();
    /**
     * @property 管理--->AI游戏区域
     */
    private Manage_AreaAIGame: AreaAIGame = null;
    /**
     * @property 管理--->AI暂存待机区域
     */
    private Manage_AreaAIStandby: AreaAIStandby = null;

    private constructor() { }

    public Init(...arr: cc.Node[]) {
        let i = 0;
        this.Manage_AreaAIGame = arr[i].getComponent(AreaAIGame);
        this.Manage_AreaAIGame.Init();
        this.Manage_AreaAIStandby = arr[i].getComponent(AreaAIStandby);
        this.Manage_AreaAIStandby.Init();
    }

    /**
    * 更新游戏开始点--->AI
    * @param pre_AICubes [Array]AI方块预制体
    * @param cube_ID 方块
    */
    public UpdatePointBegin_AI(pre_AICubes: cc.Prefab[], cube_ID?: string) {
        this.Manage_AreaAIGame.UpdatePointBegin(pre_AICubes, cube_ID);
    }

    /**
     * 设置暂存区方块
     */
    public UpdateStandbyCube() {
        this.Manage_AreaAIStandby.UpdateStandbyCube();
    }
}
