import { Grid } from "../../common/EnumScript";

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
 * @class 玩家类
 */
export default class Player {

    /**
     * 玩家出牌
     * @param touch_point 触摸点
     * @param grid_array [Array]格子
     * @param card_array [Array]卡牌
     * @param grid_pool [Pool]格子
     * @param touch_poi_pos 触摸点位置
     * @param touch_y 触摸点Y轴
     * @returns 玩家出牌是否成功
     */
    Play(touch_point: cc.Node, grid_array: cc.Node[][], card_array: cc.Node[], grid_pool: cc.NodePool, touch_poi_pos: cc.Vec2, touch_y: number): boolean {
        if (touch_point.parent.name === "Area_Game") {
            return this.PlayExchange(touch_point, touch_poi_pos, grid_array, touch_y);

        } else {
            return this.PlayCard(touch_point, grid_array, card_array, grid_pool);
        }
    }

    /**
     * 出牌
     * @param touch_point 触摸点
     * @param grid_array [Array]格子
     * @param card_array [Array]卡牌
     * @param grid_pool [Pool]格子
     * @returns 出牌是否成功
     */
    private PlayCard(touch_point: cc.Node, grid_array: cc.Node[][], card_array: cc.Node[], grid_pool: cc.NodePool): boolean {
        let world_touch = touch_point.parent.convertToWorldSpaceAR(touch_point.position);
        for (let y = 0; y < grid_array.length; y++) {
            for (let x = 0; x < grid_array[0].length; x++) {
                let node_touch = grid_array[y][x].parent.convertToNodeSpaceAR(world_touch);
                let dis = cc.pDistance(node_touch, grid_array[y][x].position);
                if (Math.abs(dis) <= 100 && grid_array[y][x].tag === Grid.grid_card) {
                    cc.log("距离为：" + dis);
                    touch_point.removeFromParent(false);
                    let ind = card_array.indexOf(touch_point);
                    card_array.splice(ind, 1);
                    grid_array[y][x].parent.addChild(touch_point);
                    touch_point.setPosition(grid_array[y][x].position);
                    grid_pool.put(grid_array[y][x]);
                    grid_array[y].splice(x, 1, touch_point);
                    return true;
                }
            }
        }
        touch_point.setPosition(0, 0);
        return false;
    }

    /**
     * 出牌交换
     * @param touch_point 触摸点
     * @param touch_poi_pos 触摸点位置
     * @param grid_array [Array]格子
     * @param touch_y 触摸点Y轴
     * @returns 交换是否成功
     */
    private PlayExchange(touch_point: cc.Node, touch_poi_pos: cc.Vec2, grid_array: cc.Node[][], touch_y: number): boolean {
        for (let y = 0; y < grid_array.length; y++) {
            for (let x = 0; x < grid_array[0].length; x++) {
                let dis = cc.pDistance(touch_point.position, grid_array[y][x].position);
                let ind_x = grid_array[touch_y].indexOf(touch_point);
                if (Math.abs(dis) <= 100 && grid_array[y][x].tag != Grid.obstacle_card && (touch_y != y || ind_x != x)) {
                    let target = grid_array[y][x];
                    touch_point.setPosition(grid_array[y][x].position);
                    grid_array[y].splice(x, 1, touch_point);
                    target.setPosition(touch_poi_pos);
                    grid_array[touch_y].splice(ind_x, 1, target);
                    return true;
                }
            }
        }
        touch_point.setPosition(touch_poi_pos);
        return false;
    }
}
