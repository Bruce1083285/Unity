/**
 * @class 弹出框类
 */
export class PopupBox {
    /**
     * @property 单例
     */
    private static intitance: PopupBox = new PopupBox();
    /**
     * @property 金币弹出框开始位置
     */
    private HintBox_Coin_StartPos: cc.Vec2 = null;

    /**
     * 私有化构造函数
     */
    private constructor() { }

    /**
     * 通用弹框--->弹出
     * @param hint 弹出框
     * @function callback 回调函数
     */
    public static CommontPopup(hint: cc.Node, callback: Function) {
        hint.active = true;
        let box = hint.getChildByName("Box");
        let scale_value = box.getScale();
        if (scale_value > 0) {
            box.scale = 0;
        }
        let Act_scale = cc.scaleTo(0.5, 1).easing(cc.easeElasticInOut(1));
        let Act_sequence = cc.sequence(Act_scale, cc.callFunc(callback));
        box.runAction(Act_sequence);
    }

    /**
     * 通用弹框--->收回
     * @param hint 弹出框
     * @function callback 回调函数
     */
    public static CommontBack(hint: cc.Node, callback: Function) {
        let box = hint.getChildByName("Box");
        let Act_scale_1 = cc.scaleTo(0.1, 1.2);
        let Act_scale_2 = cc.scaleTo(0.2, 0);
        let Act_callback = () => {
            hint.active = false;
            callback();
        }
        let Act_sequence = cc.sequence(Act_scale_1, Act_scale_2, cc.callFunc(Act_callback));
        box.runAction(Act_sequence);
    }

    /**
     * 通用购买金币不足弹出
     * @param hint 弹出框
     */
    public static CommontCoinPopup(hint: cc.Node) {
        if (hint.active) {
            hint.stopAllActions();
            hint.setPosition(PopupBox.intitance.HintBox_Coin_StartPos);
        } else {
            hint.active = true;
            PopupBox.intitance.HintBox_Coin_StartPos = hint.position;
        }
        hint.scale = 0;
        hint.opacity = 255;
        let Act_scale = cc.scaleTo(0.5, 1);
        let Act_moveTop = cc.moveBy(0.5, 0, 100);
        let Act_hide = cc.fadeOut(0.5);
        let Act_spawn = cc.spawn(Act_moveTop, Act_hide);
        let Act_sequence = cc.sequence(Act_scale, Act_spawn);
        hint.runAction(Act_sequence);
    }
}
