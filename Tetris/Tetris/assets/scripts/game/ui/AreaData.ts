import { GameManager } from "../../commont/GameManager";
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
export default class AreaData extends cc.Component {

    /**
     * @property 大恶魔激活次数label
     */
    private ActivateLabel_BigDevil: cc.Label = null;
    /**
     * @property 大恶魔激活次数
     */
    private ActivateCount_BigDevil: number = 0;
    /**
     * @property 最高连击数label
     */
    private ActivateLabel_MaxDoubleHit: cc.Label = null;
    /**
     * @property 最高连击次数
     */
    private ActivateCount_MaxDoubleHit: number = 0;
    /**
     * @property 累计攻击值label
     */
    private ActivateLabel_AddUpAttackValue: cc.Label = null;
    /**
     * @property 累计攻击值
     */
    private ActivateCount_AddUpAttackValue: number = 0;

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
        this.UpdateCount();
    }

    /**
     * 更新次数
     */
    private UpdateCount() {
        this.ActivateLabel_BigDevil.string = this.ActivateCount_BigDevil + "";
        this.ActivateLabel_MaxDoubleHit.string = this.ActivateCount_MaxDoubleHit + "";
        this.ActivateLabel_AddUpAttackValue.string = GameManager.Instance.AddUpAttack_Value + "";
    }

    /**
     * 初始化
     */
    Init() {
        this.ActivateLabel_BigDevil = this.node.getChildByName("Activate_BigDevil").getChildByName("label_count").getComponent(cc.Label);
        this.ActivateLabel_MaxDoubleHit = this.node.getChildByName("Activate_MaxDoubleHit").getChildByName("label_count").getComponent(cc.Label);
        this.ActivateLabel_AddUpAttackValue = this.node.getChildByName("Activate_AddUpAttackValue").getChildByName("label_count").getComponent(cc.Label);

        this.AddListenter();
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //更新大恶魔激活次数
        EventCenter.AddListenter(EventType.UpdateBigDevilCount, () => {
            this.UpdateBigDevilCount();
        }, "AreaData");

        //更新最高连击数
        EventCenter.AddListenter(EventType.UpdateMaxDoubleHitCount, () => {
            this.UpdateMaxDoubleHitCount();
        }, "AreaData");

        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "AreaData");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //更新大恶魔激活次数
        EventCenter.RemoveListenter(EventType.UpdateBigDevilCount, "AreaData");

        //更新最高连击数
        EventCenter.RemoveListenter(EventType.UpdateMaxDoubleHitCount, "AreaData");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "AreaData");
    }


    /**
     * 更新大恶魔激活次数
     */
    private UpdateBigDevilCount() {
        this.ActivateCount_BigDevil++;
    }

    /**
     * 更新最高连击数
     */
    private UpdateMaxDoubleHitCount() {
        this.ActivateCount_MaxDoubleHit++;
    }

    // /**
    //  * 更新累计攻击值
    //  */
    // private UpdateAddUpAttackValueCount(num: number) {
    //     this.ActivateCount_AddUpAttackValue += num;
    //     GameManager.Instance.AddUpAttack_Value = this.ActivateCount_AddUpAttackValue;
    // }
}
