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
export default class Animation_Frozen extends cc.Component {

    /**
     * @property 冰冻精灵帧
     */
    @property([cc.SpriteFrame])
    private Fram_Frozen: cc.SpriteFrame[] = [];
    /**
     * @property 图片精灵
     */
    private Spri_Img: cc.Sprite = null;
    /**
     * @property 下标索引--->开始
     */
    private Index_Begin: number = 0;
    /**
     * @property 下标索引--->开始
     */
    private Index_End: number = 0;

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
        this.Spri_Img = this.node.getChildByName("img").getComponent(cc.Sprite);
        this.Index_End = this.Fram_Frozen.length - 1;

    }

    /**
     * 播放开始动画
     */
    public PlayBegin() {
        let callback = () => {
            this.Spri_Img.spriteFrame = this.Fram_Frozen[this.Index_Begin];
            this.Index_Begin++;
            if (this.Index_Begin >= this.Fram_Frozen.length) {
                this.unschedule(callback);
                this.Spri_Img.spriteFrame = this.Fram_Frozen[this.Fram_Frozen.length - 1]
            }
        }

        this.schedule(callback, 0.05);
    }

    /**
     * 播放结束动画
     */
    public PlayEnd() {
        let callback = () => {
            this.Spri_Img.spriteFrame = this.Fram_Frozen[this.Index_End];
            this.Index_End--;
            if (this.Index_End < 0) {
                this.unschedule(callback);
                this.Spri_Img.spriteFrame = null;
            }
        }

        this.schedule(callback, 0.05);
    }
}
