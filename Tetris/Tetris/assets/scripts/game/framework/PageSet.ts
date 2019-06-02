import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";

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
export default class PageSet extends cc.Component {

    onLoad() {

    }

    start() {

    }

    // update (dt) {}

    Init() {

        this.AddListenter();
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        //显示
        EventCenter.AddListenter(EventType.ShowPageSet, () => {
            this.Show();
        }, "PageSet");

        //移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "PageSet");
    }

    /**
     * 添加监听
     */
    private RemoveListenter() {
        //显示
        EventCenter.RemoveListenter(EventType.ShowPageSet, "PageSet");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "PageSet");
    }

    /**
     * 显示
     */
    private Show() {
        this.node.active = true;
    }

    /**
     * 关闭自身
     */
    private Close() {
        this.node.active = false;
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "close":
                this.Close();
                break;
            case "bgm":
                this.SetBGM();
                break;
            case "sound":
                this.SetSound();
                break;
            default:
                break;
        }
    }

    /**
     * 设置背景音乐音量
     */
    private SetBGM() {

    }

    /**
     * 设置背景音效音量
     */
    private SetSound() {

    }
}
