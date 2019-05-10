import { EventCenter } from "./commont/EventCenter";
import { EventType } from "./commont/Enum";

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
export default class Level extends cc.Component {

    /**
     * @property [Array]关卡
     */
    private Levels: cc.Node[] = [];

    onLoad() {
        // this.Init();
    }

    /**
     * 初始化
     */
    Init() {
        this.Levels = this.node.getChildByName("Level").children;

        this.AddListenter();
        this.AddButton(this.Levels);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "back":
                this.Back();
                break;
            case "":
                break;
            case "":
                break;
            default:
                break;
        }
    }

    /**
     * 返回
     */
    private Back() {
        //返回首页
    }

    /**
     * 关卡按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private LevelButtonClick(lv: any, click: string) {
        console.log(click);
        //更新游戏背景

    }

    /**
     * 添加监听
     */
    private AddListenter() {
        //显示
        EventCenter.AddListenter(EventType.Page_LevelShow, () => {
            this.Show(this.node);
        }, "Level");

        //关闭
        EventCenter.AddListenter(EventType.Page_LevelClose, () => {
            this.Close(this.node);
        }, "Level");
    }

    /**
     * 移除监听
     */
    private RemoveListenter() {
        EventCenter.RemoveListenter(EventType.Page_LevelShow, "Level");
        EventCenter.RemoveListenter(EventType.Page_LevelClose, "Level");
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
     * 添加按钮组件
     * @param levels [Array]关卡
     */
    private AddButton(levels: cc.Node[]) {
        for (let i = 0; i < levels.length; i++) {
            let level = levels[i];
            level.addComponent(cc.Button);
            let button = level.getComponent(cc.Button);
            button.target = level;

            //实例化点击事件回调
            let clickEventHandler = new cc.Component.EventHandler();
            //绑定脚本所属节点
            clickEventHandler.target = this.node;
            //绑定脚本文件名
            clickEventHandler.component = "Level";
            //绑定按钮点击的执行函数
            clickEventHandler.handler = "LevelButtonClick";
            //绑定函数执行时传递的参数
            clickEventHandler.customEventData = level.name;
            //将点击事件回调加入按钮点击事件列表中
            button.clickEvents.push(clickEventHandler);
        }
    }
}
