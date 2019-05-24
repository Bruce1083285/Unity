import Player from "../game/Player";

/**
 * @class 游戏管理
 */
export class GameManage {
    /**
     * @property 单例
     */
    public static Instance: GameManage = new GameManage();
    /**
     * @property 报警页
     */
    public Page_Alarm: cc.Node = null;
    /**
     * @property 游戏是否开始
     */
    public IsGameStart: boolean = false;
    /**
     * @property 游戏是否开始
     */
    public IsGameEnd: boolean = false;
    /**
     * @property 是否更新进度
     */
    public IsUpdateProgress: boolean = true;
    /**
     * @property 游戏中是否可以点击
     */
    public IsGameClick: boolean = true;
    /**
     * @property 是否可以触摸点击
     */
    public IsTouchClick: boolean = false;
    /**
     * @property 相机是否跟随
     */
    public IsCameraFollow: boolean = false;
    /**
     * @property 是否监听距离
     */
    public IsListenterDis: boolean = false;
    /**
     * @property 是否开始传送
     */
    public IsPortal: boolean = false;
    /**
     * @property 定时炸弹是否正在计时
     */
    public IsTime: boolean = false;
    /**
     * @property 是否暂停
     */
    public IsPause: boolean = false;
    /**
     * @property 是否可以使用道具
     */
    public IsUseingProp: boolean = true;
    /**
     * @property 移动速度
     */
    public Speed: number = 0;
    /**
     * @property 当前特殊汽车
     */
    public Current_SpecialCar: cc.Node = null;
    /**
     * @property 完成弹框
     */
    public Finished_Box: cc.Node = null;
    /**
     * @property 排名
     */
    public Ranking: string[] = [];
    /**
     * @property [Array]角色
     */
    public Roles: cc.Node[] = [];

    /**
     * 停止目标动作
     * @param target 目标节点
     */
    public StopTargetAction(target: cc.Node) {

        if (target.name === "Player") {
            // let player = target.getComponent(Player);
            // player.Horizontal_Sensitivity = 100;

            GameManage.Instance.IsTouchClick = true;
        }
        let box = target.getChildByName("Box");
        box.stopAllActions();
        box.scale = 1;
        box.opacity = 255;
        box.rotation = 0;

        target.getComponent(cc.BoxCollider).enabled = true;
        // target.stopAllActions();
        target.opacity = 255;
    }


    public IsSkip() {

    }

}
