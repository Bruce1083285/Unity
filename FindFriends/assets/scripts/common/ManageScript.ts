import Desktop from "../game/framwork/DesktopScript";
import Game from "../game/framwork/GameScript";
import Events from "./EventScript";
import Player from "../game/framwork/PlayerScript";
import Rule from "../game/framwork/RuleScript";
import AudioData from "./AudioScript";
import { SceneD } from "./EnumScript";
import Module from "./ModuleScript";
import Music from "../game/moudel/MusicScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class 管理器类
 */
export default class Manager {
    /**
     * @property 脚本管理
     */
    private static Manage_SC: Manager = null;
    /**
     * @property 桌面管理
     */
    public Manage_Desktop: Desktop = null;
    /**
     * @property 事件管理
     */
    public Manage_Event: Events = null;
    /**
     * @property 玩家管理
     */
    public Manage_Player: Player = null;
    /**
     * @property 规则管理
     */
    public Manage_Rule: Rule = null;
    /**
     * @property 音效管理
     */
    public Manage_Audio: AudioData = null;
    /**
     * @property 模块管理
     */
    public Manage_Moudel: Module = null;
    /**
     * @property 游戏控制器
     */
    public Controller_Game: Game = null;

    private constructor() { }

    /**
     * 获取管理器
     */
    public static GetManage(scene: SceneD) {
        if (!Manager.Manage_SC) {
            Manager.Manage_SC = new Manager();
        }
        Manager.Manage_SC.Init(Manager.Manage_SC, scene);
        return Manager.Manage_SC;
    }

    /**
     * 管理器初始化
     * @param sc 管理器
     */
    private Init(sc: Manager, scene: SceneD) {
        if (scene === SceneD.loading) {
            this.Manage_Audio = new AudioData();
        }
        this.Manage_Desktop = new Desktop(sc);
        if (scene === SceneD.game) {
            this.Controller_Game = cc.find("Game").getComponent(Game);
        }
        this.Manage_Event = new Events(sc);
        this.Manage_Player = new Player();
        this.Manage_Rule = new Rule();
        this.Manage_Moudel = new Music();
    }
}