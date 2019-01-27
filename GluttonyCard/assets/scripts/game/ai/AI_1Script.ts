import AI from "../frame/AIScript";
import ScriptManage from "../common/ScriptManageScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class AI_1 extends AI {

    constructor(scriptmanage: ScriptManage) {
        super(scriptmanage);
    }
    //随机自身卡牌
    RanSelfCard() {
        let ran = Math.floor(Math.random() * this.ScriptManage.GameManage.Player_2_Cards_Array.length);
        this.Play(this.ScriptManage.GameManage.Player_2_Cards_Array[ran]);
    }
    //获取自身卡牌
    GetSelfCard() {
        //是否出牌成功
        let isplay = this.GetMaxCountSuit();
        if (isplay) {
            return;
        }
        //随机出牌
        this.RanSelfCard();
    }
    //出牌
    Play(card: cc.Node) {
        //获取出牌点
        let play_point = card.parent.parent.getChildByName("play_point");
        //世界坐标
        let wold_pos = card.parent.parent.convertToWorldSpaceAR(play_point.position);
        //本地坐标
        let node_pos = card.parent.convertToNodeSpaceAR(wold_pos);
        //卡牌移动
        card.runAction(cc.sequence(cc.moveTo(0.3, node_pos), cc.callFunc(() => {
            //从父节点中移除自身
            card.removeFromParent(false);
            play_point.addChild(card);
            card.setPosition(0, 0);
            //关闭背面
            card.getChildByName("back").active = false;
            //出牌区域卡牌添加
            this.ScriptManage.GameManage.Player_Play_Area.push(card);
            //卡牌下标索引
            let ind = this.ScriptManage.GameManage.Player_2_Cards_Array.indexOf(card);
            //从手牌中移除
            this.ScriptManage.GameManage.Player_2_Cards_Array.splice(ind, 1);
        })));
    }
    //获取最大点数的花色
    GetMaxCountSuit(): boolean {
        //最大点数
        let max_count: number = 0;
        //遍历找出最大点数
        for (let i = 0; i < this.Count_Sum_Array.length; i++) {
            if (max_count < this.Count_Sum_Array[i]) {
                max_count = this.Count_Sum_Array[i];
            }
        }
        //最大点数下标索引
        let ind = this.Count_Sum_Array.indexOf(max_count);
        //点数最大的花色
        let max_suit = parseInt(this.Suit_Array[ind]);
        //点数最大的花色为黑桃
        if (max_suit === 4) {
            //获取方块
            let blocks_node = this.GetBlocks(this.ScriptManage.GameManage.Player_2_Cards_Array);
            if (blocks_node) {
                //出牌
                this.Play(blocks_node);
                //清空点数之和数组
                this.Count_Sum_Array = [];
                //清空花色数组
                this.Suit_Array = [];
                return true;
            }
            //清空点数之和数组
            this.Count_Sum_Array = [];
            //清空花色数组
            this.Suit_Array = [];
            return false;
        }
        //获取可吃卡牌
        let iseat_node = this.GetIsEatCard(this.ScriptManage.GameManage.Player_2_Cards_Array, max_suit);
        if (iseat_node) {
            //出牌
            this.Play(iseat_node);
            //清空点数之和数组
            this.Count_Sum_Array = [];
            //清空花色数组
            this.Suit_Array = [];
            return true;
        }
        //清空点数之和数组
        this.Count_Sum_Array = [];
        //清空花色数组
        this.Suit_Array = [];
        return false;
    }
}
