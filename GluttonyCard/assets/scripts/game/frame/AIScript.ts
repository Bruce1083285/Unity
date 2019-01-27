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

export default abstract class AI {
    //-----------属性
    //脚本管理器
    protected ScriptManage: ScriptManage = null;
    //是否存在方块
    protected IsBlocks: boolean = null;
    //是否存在黑桃
    protected IsSpade: boolean = null;
    //点数之和数组
    protected Count_Sum_Array: number[] = [];
    //花色数组
    protected Suit_Array: string[] = [];

    /**
     * 构造函数
     * @param scriptmanage 脚本管理类
     */
    constructor(scriptmanage: ScriptManage) {
        //获取脚本管理器
        this.ScriptManage = scriptmanage;
    }
    /**
     * 查找公共区域卡牌点数花色
     * @param com_arr 公共区域卡牌数组
     */
    SelectCommonCard(com_arr: cc.Node[]) {
        //临时二维数组
        let patch_two_array: cc.Node[][] = this.SelectRedoSuit(com_arr);
        //计算点数差值
        let isran = this.SelectCountDifference(patch_two_array);
        //是否随机
        if (isran) {
            //获取自身卡牌
            this.GetSelfCard();
        } else {
            //随机自身卡牌
            this.RanSelfCard();
        }
    }
    /**
     * 找出重复花色
     * @param com_arr 公共区域卡牌
     * @returns 二维数组：公共区域卡牌花色分类
     */
    SelectRedoSuit(com_arr: cc.Node[]): cc.Node[][] {
        //临时公共区域数组
        let patch_com_arr: cc.Node[] = [];
        //重新添加数组防止修改原引用内存
        for (let i = 0; i < com_arr.length; i++) {
            patch_com_arr.push(com_arr[i]);
        }
        //临时一维数组
        let patch_one_array: cc.Node[] = [];
        //临时二维数组
        let patch_two_array: cc.Node[][] = [];
        //找出重复花色
        for (let i = 0; i < patch_com_arr.length; i++) {
            //添加首个元素
            patch_one_array.push(patch_com_arr[i]);
            //获取i元素花色
            let i_suit = patch_com_arr[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name;
            for (let j = 0; j < patch_com_arr.length - i - 1; j++) {
                //获取j元素花色
                let j_suit = patch_com_arr[j + i + 1].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name;
                //判断花色
                if (i_suit === j_suit) {
                    //放入一维数组中
                    patch_one_array.push(patch_com_arr[j + i + 1]);
                    //将重复元素移除
                    patch_com_arr.splice(j + i + 1, 1);
                    //重复此次循环
                    j--;
                }
            }
            //将一维数组放入二维数组中
            patch_two_array.push(patch_one_array);
            //清空一维数组
            patch_one_array = [];
        }
        return patch_two_array;
    }
    /**
     * 计算点数差值
     * @param patch_two_array 公共区域卡牌分类二维数组
     * @returns 布尔值
     */
    SelectCountDifference(patch_two_array: cc.Node[][]): boolean {
        //计算每种花色点数之和
        for (let i = 0; i < patch_two_array.length; i++) {
            //点数总和
            let count_sum: number = 0;
            for (let j = 0; j < patch_two_array[i].length; j++) {
                //获取点数
                let count = parseInt(patch_two_array[i][j].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
                //判断卡牌是否为A
                if (count === 14) {
                    count = 1;
                }
                count_sum += count;
            }
            //数组中添加点数总和
            this.Count_Sum_Array.push(count_sum);
            //数组中添加对应花色
            let suit = patch_two_array[i][0].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name;
            this.Suit_Array.push(suit);
        }
        //获取最小点数
        let min_count = this.Count_Sum_Array[0];
        for (let i = 0; i < this.Count_Sum_Array.length; i++) {
            if (min_count > this.Count_Sum_Array[i]) {
                min_count = this.Count_Sum_Array[i];
            }
        }
        //获取最大点数
        let max_count = this.Count_Sum_Array[0];
        for (let i = 0; i < this.Count_Sum_Array.length; i++) {
            if (max_count < this.Count_Sum_Array[i]) {
                max_count = this.Count_Sum_Array[i];
            }
        }
        //判断是否随机
        let difference = max_count - min_count;
        if (difference > 15) {
            return true;
        }
        return false;
    }
    /**
     * 获取方块
     * @param card_arr 卡牌数组
     */
    GetBlocks(card_arr: cc.Node[]): cc.Node {
        //临时方块数组
        let patch_blocks: cc.Node[] = [];
        for (let i = 0; i < card_arr.length; i++) {
            //获取卡牌花色
            let card_suit = parseInt(card_arr[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
            if (card_suit === 1) {
                //获取方块
                patch_blocks.push(card_arr[i]);
            }
        }
        if (patch_blocks.length > 0) {
            let max_count = parseInt(patch_blocks[0].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name)
            let max_count_node = patch_blocks[0];
            for (let i = 0; i < patch_blocks.length; i++) {
                let blocks_count = parseInt(patch_blocks[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
                if (max_count < blocks_count) {
                    //存储最大点数
                    max_count = blocks_count;
                    //存储最大点数的节点
                    max_count_node = patch_blocks[i];
                }
            }
            return max_count_node;
        }
        return;
    }
    /**
     * 获取可吃卡牌
     * @param card_arr 卡牌数组
     * @param max_suit 最大花色
     */
    GetIsEatCard(card_arr: cc.Node[], max_suit: number): cc.Node {
        //临时花色数组
        let patch_suit: cc.Node[] = [];
        for (let i = 0; i < card_arr.length; i++) {
            //获取卡牌花色
            let card_suit = parseInt(card_arr[i].getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name);
            if (card_suit === max_suit + 1) {
                //获取匹配花色
                patch_suit.push(card_arr[i]);
            }
        }
        //匹配成功
        if (patch_suit.length > 0) {
            let max_count = parseInt(patch_suit[0].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name)
            let max_count_node = patch_suit[0];
            for (let i = 0; i < patch_suit.length; i++) {
                let suit_count = parseInt(patch_suit[i].getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name);
                if (max_count < suit_count) {
                    //存储最大点数
                    max_count = suit_count;
                    //存储最大点数的节点
                    max_count_node = patch_suit[i];
                }
            }
            return max_count_node;
        }
    }
    /**
     * 出牌
     * @param card 卡牌
     */
    abstract Play(card: cc.Node);
    /**
     * 随机自身卡牌
     */
    abstract RanSelfCard();
    /**
     * 获取自身卡牌
     */
    abstract GetSelfCard();
}
