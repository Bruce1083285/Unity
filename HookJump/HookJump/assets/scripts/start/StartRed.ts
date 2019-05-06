import Cache from "../common/Cache";
import { CacheType } from "../common/Enum";

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
export default class StartRed extends cc.Component {

    /**
     * 红包数
     */
    private Red_Num: cc.Label = null;

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.node.active = true;

        this.Red_Num = this.node.getChildByName("red_num").getComponent(cc.Label);

        this.GetCache();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        if (click === "close") {
            this.node.active = false;
        }
    }

    /**
     * 获取缓存
     */
    private GetCache() {
        let red_num = Cache.GetCache(CacheType.Red_Num);
        if (red_num) {
            this.Red_Num.string = red_num;
        } else {
            this.Red_Num.string = "0";
        }
    }
}
