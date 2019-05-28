
/**
 * @class 模式管理器
 */
export class ModeManager {

    /**
     * 被选中模式显示
     * @param mode 模式父节点
     * @param mode_id 对应模式ID
     */
    public SelectModeShow(mode: cc.Node, mode_id: string) {
        this.SetModeShow(mode, mode_id);
    }

    /**
     * 被选中模式显示
     * @param mode 模式父节点
     * @param mode_id 对应模式ID
     */
    private SetModeShow(mode: cc.Node, mode_id: string) {
        let big_value: number = 5;
        let small_value: number = 4;
        let dt: number = 0.1;
        let mo_Ndoe_id: cc.Node = mode.getChildByName(mode_id);

        if (mo_Ndoe_id.scale !== small_value) {
            return;
        }
        let act_Scale_big = cc.scaleTo(dt, big_value);
        mo_Ndoe_id.runAction(act_Scale_big);

        let arr = mode.children;
        for (let i = 0; i < arr.length; i++) {
            let mo_chi = arr[i];
            if (mo_chi.name !== mode_id) {
                if (mo_chi.scale === small_value) {
                    continue;
                }
                if (mo_chi.scale !== small_value) {
                    mo_chi.stopAllActions();
                }
                let act_Scale_small = cc.scaleTo(dt, small_value);
                mo_chi.runAction(act_Scale_small);
            }
        }
    }
}
