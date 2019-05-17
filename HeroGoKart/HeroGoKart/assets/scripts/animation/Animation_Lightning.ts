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
export default class Animation_Lightning extends cc.Component {


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
        this.Play();
    }

    /**
     * 播放动画
     */
    private Play() {
        let act_move_1 = cc.moveBy(0.05, 10, 10);
        let act_move_2 = cc.moveBy(0.05, -10, -10);
        let act_dt = cc.delayTime(3);
        let act_seq = cc.sequence(act_move_1, act_move_2, act_move_1, act_move_2, act_dt).repeatForever();
        this.node.runAction(act_seq);
    }
}
