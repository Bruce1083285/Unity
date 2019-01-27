import ScriptManage from "../common/ScriptManageScript";
import Card from "./CardScript";
//导入枚举
import { PosTag, PlayerNo } from "../common/EnumManageScript";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class RuleJudge {

    //-----------属性
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //是否有方块
    private IsBlocks: boolean = false;
    //是否有黑桃
    private IsSpade: boolean = false;
    //被吃卡牌
    public Eat_Cards_Array: cc.Node[] = [];
    /**
     * 构造含少数
     * @param scriptmanage 脚本管理类
     */
    constructor(scriptmanage) {
        //获取管理器脚本
        this.ScriptManage = scriptmanage;
    }
    /**
     * 规则判定
     * @param play_area_cards  玩家出牌区域卡牌数组
     * @param com_arr 公共区域卡牌数组
     */
    RuleJudge(play_area_cards: cc.Node[], com_arr: cc.Node[]) {
        //查找黑桃和方块
        for (let i = 0; i < play_area_cards.length; i++) {
            let card_suit = parseInt(play_area_cards[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
            //如果是黑桃
            if (card_suit === 4) {
                this.IsSpade = true;
            }
            //如果是方块
            if (card_suit === 1) {
                this.IsBlocks = true;
            }
        }
        //最大花色存储
        let max_suit = parseInt(play_area_cards[0].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
        //最大花色节点存储
        let max_suit_node = play_area_cards[0];
        //获取最大花色重复卡牌
        let patch_array: cc.Node[] = [];
        //黑桃方块同时存在
        if (this.IsSpade && this.IsBlocks) {
            //最大花色为方块
            max_suit = 1;
            for (let i = 0; i < play_area_cards.length; i++) {
                let card_suit = parseInt(play_area_cards[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
                if (max_suit === card_suit) {
                    //赋值最大花色节点
                    max_suit_node = play_area_cards[i];
                    patch_array.push(play_area_cards[i]);
                }
            }
        } else {
            //获取最大花色
            for (let i = 0; i < play_area_cards.length; i++) {
                let card_suit = parseInt(play_area_cards[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
                if (max_suit < card_suit) {
                    max_suit = card_suit;
                    max_suit_node = play_area_cards[i];
                }
            }
            //最大花色是否重复
            for (let i = 0; i < play_area_cards.length; i++) {
                let card_suit = parseInt(play_area_cards[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
                if (max_suit === card_suit) {
                    patch_array.push(play_area_cards[i]);
                }
            }
        }
        //判断是否重复
        if (patch_array.length <= 1) {
            //花色可吃的牌
            this.SuitIsEatCard(max_suit, play_area_cards, com_arr);
            //吃牌
            this.EatCard(max_suit_node);
        } else {
            //存储最大点数
            let max_count = parseInt(patch_array[0].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
            //最大点数节点
            let max_count_node = patch_array[0];
            for (let i = 0; i < patch_array.length; i++) {
                let card_count = parseInt(patch_array[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
                if (max_count < card_count) {
                    max_count = card_count;
                    max_count_node = patch_array[i];
                }
            }
            //点数可吃的牌
            this.CountEatCard(max_count, max_suit, play_area_cards, com_arr);
            //吃牌
            this.EatCard(max_count_node);
        }
        //重置黑桃存在确认
        this.IsSpade = false;
        //重置方块存在确认
        this.IsBlocks = false;
        return false;
    }
    /**
     * 花色可以被吃的卡牌
     * @param max_suit 最大花色
     * @param play_area_cards 玩家出牌区域卡牌数组
     * @param com_arr 公共区域卡牌数组
     */
    SuitIsEatCard(max_suit: number, play_area_cards?: cc.Node[], com_arr?: cc.Node[]) {
        //判断最大花色是否为方块
        if (max_suit === 1) {
            max_suit = 5;
        }
        //遍历出牌区域卡牌
        for (let i = 0; i < play_area_cards.length; i++) {
            let card_suit = parseInt(play_area_cards[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
            if (max_suit - 1 === card_suit) {
                //存储可吃卡牌
                this.Eat_Cards_Array.push(play_area_cards[i]);
                //出牌区域卡牌移除
                play_area_cards.splice(i, 1);
                //重置此次循环
                i--;
            }
        }
        //遍历公共区域
        for (let i = 0; i < com_arr.length; i++) {
            let card_suit = parseInt(com_arr[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
            if (max_suit - 1 === card_suit) {
                //存储可吃卡牌
                this.Eat_Cards_Array.push(com_arr[i]);
                //出牌区域卡牌移除
                com_arr.splice(i, 1);
                //重置此次循环
                i--;
            }
        }
    }
    /**
     * 点数可以被吃的卡牌
     * @param max_count 最大点数
     * @param max_suit 最大花色
     * @param play_area_cards 玩家出牌区域卡牌数组
     * @param com_arr 公共区域卡牌数组
     */
    CountEatCard(max_count: number, max_suit, play_area_cards: cc.Node[], com_arr: cc.Node[]) {
        //遍历出牌区域卡牌
        for (let i = 0; i < play_area_cards.length; i++) {
            //卡牌花色
            let card_suit = parseInt(play_area_cards[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name)
            if (max_suit === card_suit) {
                //卡牌点数
                let card_count = parseInt(play_area_cards[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
                if (max_count > card_count) {
                    //放入可吃卡牌
                    this.Eat_Cards_Array.push(play_area_cards[i]);
                    //出牌区域移除卡牌
                    play_area_cards.splice(i, 1);
                    //重复此次循环
                    i--;
                }
            }
        }
        //遍历公共区域
        for (let i = 0; i < com_arr.length; i++) {
            //卡牌花色
            let card_suit = parseInt(com_arr[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name)
            if (max_suit === card_suit) {
                let card_count = parseInt(com_arr[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
                if (max_count > card_count) {
                    //放入可吃卡牌
                    this.Eat_Cards_Array.push(com_arr[i]);
                    //公共区域移除卡牌
                    com_arr.splice(i, 1);
                    //重复此次循环
                    i--;
                }
            }
        }
    }
    /**
     * 吃牌
     * @param target 吃牌方
     */
    EatCard(target: cc.Node) {
        //临时移动次数记录
        let num = 0;
        //玩家编号
        let player = target.parent.parent;
        //手牌区域
        let card_area = player.getChildByName("Card_Area");
        //世界坐标
        let wold_pos = player.convertToWorldSpaceAR(card_area.position);
        for (let i = 0; i < this.Eat_Cards_Array.length; i++) {
            let node_pos = this.Eat_Cards_Array[i].parent.convertToNodeSpaceAR(wold_pos);
            //移动
            this.Eat_Cards_Array[i].runAction(cc.sequence(cc.moveTo(0.3, node_pos), cc.callFunc(() => {
                //从父节点中移除
                this.Eat_Cards_Array[i].removeFromParent(false);
                card_area.addChild(this.Eat_Cards_Array[i]);
                // this.Eat_Cards_Array[i].setPosition(0, 0);
                num++;
                //移动次数结束
                if (num === this.Eat_Cards_Array.length) {
                    //重置卡牌
                    this.CardReset();
                }
            })));
            //玩家1
            if (target.tag === PosTag.Plyaer_1) {
                //设置标签
                this.Eat_Cards_Array[i].tag = PosTag.Plyaer_1;
                //放入手牌
                this.ScriptManage.GameManage.Player_1_Cards_Array.push(this.Eat_Cards_Array[i]);
            }
            //玩家2
            if (target.tag === PosTag.Plyaer_2) {
                //设置标签
                this.Eat_Cards_Array[i].tag = PosTag.Plyaer_2;
                //放入手牌
                this.ScriptManage.GameManage.Player_2_Cards_Array.push(this.Eat_Cards_Array[i]);
            }
            //玩家3
            if (target.tag === PosTag.Plyaer_3) {
                //设置标签
                this.Eat_Cards_Array[i].tag = PosTag.Plyaer_3;
                //放入手牌
                this.ScriptManage.GameManage.Player_3_Cards_Array.push(this.Eat_Cards_Array[i]);
            }
        }
    }
    /**
     * 重置卡牌
     */
    CardReset() {
        //玩家1
        //重置卡牌位置
        this.RestCardPos(this.ScriptManage.GameManage.Player_1_Cards_Array, PosTag.Plyaer_1);
        //玩家2
        //重置卡牌位置
        this.RestCardPos(this.ScriptManage.GameManage.Player_2_Cards_Array, PosTag.Plyaer_2);
        //玩家3
        //重置卡牌位置
        this.RestCardPos(this.ScriptManage.GameManage.Player_3_Cards_Array, PosTag.Plyaer_3);
        //计算分数
        this.ComputePlayerScore(this.ScriptManage.GameManage.Player_1_Cards_Array);
        //赋值移动结束
        this.ScriptManage.GameManage.IsMove_Over = true;
        //清空可吃数组
        this.Eat_Cards_Array = [];
    }
    /**
     * 重置卡牌位置
     * @param card_array 玩家手牌数组
     * @param palyernom 玩家标签
     */
    RestCardPos(card_array: cc.Node[], palyernom: PosTag) {
        for (let i = 0; i < card_array.length; i++) {
            //玩家1
            if (palyernom === PosTag.Plyaer_1) {
                card_array[i].setPosition(i * 30, 0);
                //卡牌状态为可以使用
                card_array[i].getComponent(Card).InitCard(true);
            }
            //玩家2
            if (palyernom === PosTag.Plyaer_2) {
                card_array[i].setPosition(i * 10, 0);
                //卡牌状态为可以使用
                card_array[i].getComponent(Card).InitCard(false);
            }
            //玩家3
            if (palyernom === PosTag.Plyaer_3) {
                card_array[i].setPosition(i * 10, 0);
                //卡牌状态为可以使用
                card_array[i].getComponent(Card).InitCard(false);
            }
        }
    }
    /**
     * 玩家点数对比
     * @param player_1_array 玩家1手牌
     * @param player_2_array 玩家2手牌
     * @param player_3_array 玩家3手牌
     */
    PlayerCountContrast(player_1_array: cc.Node[], player_2_array: cc.Node[], player_3_array: cc.Node[], ) {
        //点数之和临时数组
        let patch_count_sum: number[] = [];
        //玩家1点数之和
        let player_1_sum: number = 0;
        if (player_1_array.length > 0) {
            player_1_sum = this.CardSum(player_1_array);
            patch_count_sum.push(player_1_sum);
        }
        //玩家2点数之和
        let player_2_sum: number = 0;
        if (player_2_array.length > 0) {
            player_2_sum = this.CardSum(player_2_array);
            patch_count_sum.push(player_2_sum);
        }
        //玩家3点数之和
        let player_3_sum: number = 0;
        if (player_3_array.length > 0) {
            player_3_sum = this.CardSum(player_3_array);
            patch_count_sum.push(player_3_sum);
        }
        //遍历点数之和数组
        let max_count: number = 0;
        for (let i = 0; i < patch_count_sum.length; i++) {
            if (max_count < patch_count_sum[i]) {
                max_count = patch_count_sum[i];
            }
        }
        //激活结束页
        this.ScriptManage.GameManage.Over_Page.active = true;
        //训练模式游戏结束
        if (this.ScriptManage.GameManage.Game_Mod === "drill") {
            //游戏结束
            this.ScriptManage.GameManage.Over_Title.getChildByName("youxijiehsu").active = true;
            //游戏分数
            this.ScriptManage.GameManage.Over_Page.getChildByName("Score").active = false;
            this.ScriptManage.GameManage.Over_Page.getChildByName("youxijiehsu").active = true;
        } else {
            //分数对比
            if (max_count === player_1_sum) {
                //玩家胜利
                this.ScriptManage.GameManage.Over_Title.getChildByName("shengli").active = true;
            } else {
                //玩家失败
                this.ScriptManage.GameManage.Over_Title.getChildByName("shibai").active = true;
            }
            //计算玩家分数
            this.ComputePlayerScore(this.ScriptManage.GameManage.Player_1_Cards_Array);
        }
    }
    /**
     * 手牌总和
     * @param array 玩家手牌数组
     * @returns 总和
     */
    CardSum(array: cc.Node[]): number {
        let card_sum: number = 0;
        for (let i = 0; i < array.length; i++) {
            let card_count = parseInt(array[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
            card_sum += card_count;
        }
        return card_sum;
    }
    /**
     * 计算玩家分数
     * @param player_1_array 玩家1手牌数组
     */
    ComputePlayerScore(player_1_array: cc.Node[]) {
        // if (max_count) {
        //     //分数赋值
        //     this.ScriptManage.GameManage.Score.string = max_count + "";
        //     //结束页分数赋值
        //     this.ScriptManage.GameManage.Over_Score.string = max_count + "";
        // } else {
        //玩家1点数之和
        let player_1_sum: number = 0;
        for (let i = 0; i < player_1_array.length; i++) {
            let card_count = parseInt(player_1_array[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
            if (card_count === 14) {
                card_count = 1;
            }
            player_1_sum += card_count;
        }
        //分数赋值
        this.ScriptManage.GameManage.Score.string = player_1_sum + "";
        //结束页分数赋值
        this.ScriptManage.GameManage.Over_Score.string = player_1_sum + "";
    }
}
