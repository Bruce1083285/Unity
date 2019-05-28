import { ViewManager } from "./ViewManager";

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
     * @property 模式父节点
     */
    private Mode: cc.Node = null;
    /**
     * @property 当前模式ID
     */
    private Current_Mode_ID: string = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Mode = this.node.getChildByName("Mode");
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "begin":
                this.BeginGame();
                break;
            default:
                this.SelectModeShow(this.Mode, click);
                break;
        }
    }

    /**
     * 开始游戏
     */
    private BeginGame() {
        if (!this.Current_Mode_ID) {
            return
        }
        console.log(this.Current_Mode_ID);
        this.Current_Mode_ID = "1v1"
        cc.director.loadScene(this.Current_Mode_ID);
    }

    /**
     * 被选中模式显示
     * @param mode 模式父节点
     * @param mode_id 对应模式ID
     */
    private SelectModeShow(mode: cc.Node, mode_id: string) {
        ViewManager.Instance.SelectModeShow(mode, mode_id);
        this.Current_Mode_ID = mode_id;
    }
}
