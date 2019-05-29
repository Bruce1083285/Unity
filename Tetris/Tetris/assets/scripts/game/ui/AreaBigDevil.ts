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
export default class AreaBigDevil extends cc.Component {


    /**
     * @property 倒计时label
     */
    private Bar_Time: cc.ProgressBar = null;
    /**
     * @property 倒计时label
     */
    private Label_Time: cc.Label = null;

    onLoad() {
        this.Init();
    }

    update(dt) {

    }

    /**
     * 初始化
     */
    private Init() {
        this.Bar_Time = this.node.getChildByName("Time").getChildByName("Bar_Time").getComponent(cc.ProgressBar);
        this.Label_Time = this.node.getChildByName("Time").getChildByName("labe_time").getComponent(cc.Label);

        this.UpdateTime();
    }

    /**
     * 更新倒计时
     */
    private UpdateTime() {
        let time: number = 20;
        let str: string = "00:"
        this.Label_Time.string = str + time;
        this.Bar_Time.progress = time / 20;
        let callback = () => {
            time--;
            if (time === 9) {
                str = "00:0";
            }
            this.Label_Time.string = str + time;
            this.Bar_Time.progress = time / 20;


            if (time <= 0) {
                this.unschedule(callback);
            }
        }
        this.schedule(callback, 1);
    }
}
