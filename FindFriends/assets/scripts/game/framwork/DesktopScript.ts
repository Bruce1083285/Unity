import Manager from "../../common/ManageScript";
import Card from "./CardScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class 桌面类
 */
export default class Desktop {

    /**
     * @property 脚本管理
     */
    private Manage_SC: Manager = null;

    constructor(sc: Manager) {
        this.Manage_SC = sc;
    }

    /**
     * 设置游戏区域
     * @param grid_pool [Pool]格子牌
     * @param obstacle_pool [Pool]障碍牌
     * @param row 行
     * @param line 列
     * @param game_area 游戏区域
     * @param level_model 关卡模型
     * @param level_num 关卡数
     * @returns 卡牌二维排版
     */
    setGameArea(grid_pool: cc.NodePool, obstacle_pool: cc.NodePool, row: number, line: number, game_area: cc.Node, level_model: object, level_num: number): cc.Node[][] {
        let array_1 = level_model[level_num];
        let array_2 = [];
        let array_3 = [];
        for (let y = 0; y < line; y++) {
            for (let x = 0; x < row; x++) {
                let grid: cc.Node = null;
                if (array_1[y][x] === 0) {
                    grid = grid_pool.get();
                    if (!grid) {
                        this.Manage_SC.Controller_Game.getGridPool();
                        grid = grid_pool.get();
                    }
                } else {
                    grid = obstacle_pool.get();
                    if (!grid) {
                        this.Manage_SC.Controller_Game.getObstacleCardPool();
                        grid = obstacle_pool.get();
                    }
                }
                game_area.addChild(grid);
                grid.setPosition(119 * x + 59.5, 152 * y + 76);
                array_2.push(grid);
            }
            array_3.push(array_2);
            array_2 = [];
        }
        return array_3;
    }

    /**
     * 设置卡牌区域
     * @param card_area 卡牌区域
     * @param card_pool [Pool]卡牌
     * @param card_array [Array]卡牌
     */
    setCardArea(card_area: cc.Node, card_pool: cc.NodePool, card_array: cc.Node[]) {
        //牌堆
        let card_heap = card_area.getChildByName("Card_Heap");
        //手牌数
        let card_hand_array = card_area.getChildByName("Card_Hand").children;
        //牌堆世界坐标
        let world_heap = card_area.convertToWorldSpaceAR(card_heap.position);
        for (let i = 0; i < card_hand_array.length; i++) {
            let card_hand_num = card_hand_array[i].children.length;
            if (card_hand_num <= 0) {
                let card = card_pool.get();
                if (!card) {
                    this.Manage_SC.Controller_Game.getCardPool();
                    card = card_pool.get();
                }
                card_hand_array[i].addChild(card);
                this.Manage_SC.Manage_Event.onEventListening(card);
                let node_hand = card_hand_array[i].convertToNodeSpaceAR(world_heap);
                card.setPosition(node_hand);
                card.runAction(cc.sequence(cc.moveTo(0.1, 0, 0), cc.callFunc(() => {
                    card.getComponent(Card).IsUse = true;
                })));
                card_array.push(card);
            }
        }
    }
}
