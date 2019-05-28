
/**
 * @class 弹窗类
 */
export class Popup {

    /**
     * @property 是否可以点击
     */
    private IsClick: boolean = true;

    /**
     * 弹窗显示
     * @param popup_node 弹窗节点
     */
    public PopupShow(popup_node: cc.Node) {

    }

    /**
     * 弹窗隐藏
     * @param popup_node 弹窗节点
     */
    public PopupHide(popup_node: cc.Node) {

    }

    /**
     * 设置按钮显示
     * @param but_Switchs 设置按钮开关
     * @param but_open 开启按钮节点
     * @param but_close 关闭按钮节点
     * @param box 设置面板节点
     */
    public ButSetShow(but_Switchs: cc.Node, but_open: cc.Node, but_close: cc.Node, box: cc.Node) {
        if (!this.IsClick) {
            return;
        }
        this.IsClick = false;

        let act_moveUp = cc.moveBy(0.2, 0, 180);
        let act_callback = () => {
            but_open.active = false;
            but_close.active = true;
            box.active = true;

            this.IsClick = true;
        }
        let act_seq = cc.sequence(act_moveUp, cc.callFunc(act_callback));
        but_Switchs.runAction(act_seq);
    }

    /**
     * 设置按钮隐藏
     * @param but_Switchs 设置按钮开关
     * @param but_open 开启按钮节点
     * @param but_close 关闭按钮节点
     * @param box 设置面板节点
     */
    public ButSetHide(but_Switchs: cc.Node, but_open: cc.Node, but_close: cc.Node, box: cc.Node) {
        if (!this.IsClick) {
            return;
        }
        this.IsClick = false;
        box.active = false;

        let act_moveUp = cc.moveBy(0.2, 0, -180);
        let act_callback = () => {
            but_open.active = true;
            but_close.active = false;

            this.IsClick = true;
        }
        let act_seq = cc.sequence(act_moveUp, cc.callFunc(act_callback));
        but_Switchs.runAction(act_seq);
    }
}
