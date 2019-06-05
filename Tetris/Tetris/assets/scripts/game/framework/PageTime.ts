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
export default class NewClass extends cc.Component {

    /**
     * @property 倒计时label
     */
    private Label_Time: cc.Label = null;

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
        this.Label_Time = this.node.getChildByName("label_Time").getComponent(cc.Label);

        this.Time();
    }

    /**
     * 倒计时
     */
    private Time() {
        let time: number = 3;
        this.Label_Time.string = time + "";

        let callback = () => {
            time--;
            this.Label_Time.string = time + "";
            if (time <= 0) {
                this.node.active = false;
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 1);
    }
}
