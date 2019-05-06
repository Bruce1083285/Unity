import Game from "../Game";
import { Prop } from "../common/Enum";

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
export default class Stage extends cc.Component {

    /**
     * @property 游戏类
     */
    private Game: Game = null;
    /**
     * @property 平台移动动作
     */
    public Stage_Action: cc.Action = null;
    /**
     * @property 奖励
     */
    private Award: cc.Node = null;

    /**
     * 初始化
     * @param min_width 最小宽度
     * @param max_width 最大宽度
     */
    Init(min_width: number, max_width: number, skin: cc.SpriteFrame) {
        this.Game = cc.find("Canvas").getComponent(Game);
        this.Award = this.node.getChildByName("award");

        this.node.getComponent(cc.Sprite).spriteFrame = skin;
        this.Award.active = true;

        this.SetSelfWidth(this.node, min_width, max_width, this.node.height);
        this.AddBoxCollision(this.node, this.Award);
        // //判断当前道具
        // if (this.Game.Current_Prop === Prop.StageMove) {
        //     this.SetMove();
        // }
    }

    Play() {
        this.SetStageAnim(this.node);
    }

    /**
     * 向下移动
     * @param dt 持续时间
     * @param dis_y Y轴距离
     */
    MoveDown(dt: number, dis_y: number) {
        let move_down = cc.moveBy(dt, 0, dis_y);
        this.node.runAction(move_down);
    }

    /**
     * 设置自身宽度
     * @param self 自身
     * @param min_width 最小宽度
     * @param max_width 最大宽度
     * @param hight 高度
     */
    private SetSelfWidth(self: cc.Node, min_width: number, max_width: number, hight: number) {
        let ran_width = Math.floor(Math.random() * (max_width - min_width) + min_width);
        self.setContentSize(ran_width, hight);
    }

    /**
     * 添加碰撞
     * @param self 自身节点
     * @param award 奖励节点
     */
    private AddBoxCollision(self: cc.Node, award: cc.Node) {
        let self_box = self.getComponent(cc.BoxCollider);
        if (!self_box) {
            // self.getComponent(cc.BoxCollider).enabled = true;
            // return;
            self_box = self.addComponent(cc.BoxCollider);
            self.group = "Stage";
            cc.log('2222222222222222');
        }
        //自身添加组件
        self_box.enabled = true;
        self_box.offset = cc.v2(0, -5);
        self_box.size = cc.size(self.width, 10);

        //奖励添加组件
        let award_box = award.getComponent(cc.BoxCollider);
        if (!award_box) {
            cc.log('33333333333333');
            award_box = award.addComponent(cc.BoxCollider);
            award.group = "Award";
        }
        award_box.offset = cc.v2(0.5, 49);
        award_box.size = cc.size(97, 97);
    }

    /**
     * 设置台阶抖动动画
     * @param self 自身节点
     */
    private SetStageAnim(self: cc.Node) {
        let pos = self.position;
        let shake_1 = cc.moveBy(0.05, 10, 10);
        let shake_2 = cc.moveBy(0.05, -10, -10);
        let callbacks = cc.callFunc(() => {
            self.setPosition(pos);
        })
        this.node.runAction(cc.sequence(shake_1, shake_2, shake_1, shake_2, callbacks));
    }


    /**
     * 设置移动
     */
    SetMove() {
        let self = this.node;
        // let world_pos = self.parent.convertToWorldSpaceAR(self.position);
        let size = self.getContentSize();
        let diss_left = size.width / 2;
        let diss_right = cc.winSize.width - size.width / 2;
        let move_left = cc.moveTo(2, cc.v2(diss_left, self.position.y));
        let move_right = cc.moveTo(2, cc.v2(diss_right, self.position.y));
        let sequence = cc.sequence(move_left, move_right);

        this.Stage_Action = self.runAction(cc.repeatForever(sequence));
    }
}
