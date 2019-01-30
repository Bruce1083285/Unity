import Card from "./CardScript";
import { Color, SuitPos, Grid } from "../../common/EnumScript";

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
 * @class 规则类
 */
export default class Rule {

    /**
     * @property 通过数
     */
    private Pass_Count: number = 0;

    /**
     * 回合检测
     * @param grid_array [Array]格子
     * @param score_count 分数
     * @param pass_hold_array [Array]通过暂存
     */
    RoundDetection(grid_array: cc.Node[][], score_count: cc.Label, pass_hold_array: cc.Node[]) {
        // let x = grid_array[touch_y].indexOf(touch_point);
        // //自身检测
        // this.setIsPass(grid_array, touch_point, touch_y, x);
        // //上节点检测
        // if (touch_y + 1 < grid_array.length && grid_array[touch_y + 1][x].tag === Grid.card) {
        //     this.setIsPass(grid_array, grid_array[touch_y + 1][x], touch_y + 1, x);
        // }
        // //下节点检测
        // if (touch_y - 1 >= 0 && grid_array[touch_y - 1][x].tag === Grid.card) {
        //     this.setIsPass(grid_array, grid_array[touch_y - 1][x], touch_y - 1, x);
        // }
        // //右节点检测
        // if (x + 1 < grid_array[0].length && grid_array[touch_y][x + 1].tag === Grid.card) {
        //     this.setIsPass(grid_array, grid_array[touch_y][x + 1], touch_y, x + 1);
        // }
        // //左节点检测
        // if (x - 1 >= 0 && grid_array[touch_y][x - 1].tag === Grid.card) {
        //     this.setIsPass(grid_array, grid_array[touch_y][x - 1], touch_y, x - 1);
        // }
        for (let y = 0; y < grid_array.length; y++) {
            for (let x = 0; x < grid_array[0].length; x++) {
                if (grid_array[y][x].tag === Grid.card) {
                    // let suit = grid_array[y][x].getComponent(Card).RightAndUp;
                    // if (suit != Color.any) {
                    this.setIsPass(grid_array, grid_array[y][x], y, x, score_count, pass_hold_array);
                    // } else {
                    //     this.Pass_Count++;
                    // }
                }
            }
        }
        // score_count.string = this.Pass_Count * 50 + "";
        // this.Pass_Count = 0;
    }

    /**
     * 结束检测
     * @param grid_array [Array]格子
     */
    OverDetection(grid_array: cc.Node[][]): boolean {
        for (let y = 0; y < grid_array.length; y++) {
            for (let x = 0; x < grid_array[0].length; x++) {
                if (grid_array[y][x].tag === Grid.card) {
                    let ispass = grid_array[y][x].getComponent(Card).IsPass;
                    if (!ispass) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * 设置是否通过
     * @param grid_array [Array]格子
     * @param self 自身节点
     * @param y 自身Y轴
     * @param score_count 分数
     * @param pass_hold_array [Array]通过暂存
     */
    private setIsPass(grid_array: cc.Node[][], self: cc.Node, y: number, x: number, score_count: cc.Label, pass_hold_array: cc.Node[]) {
        let right_And_up = false;
        let left_And_down = false;
        //右上死角检测
        if (y + 1 >= grid_array.length && x + 1 >= grid_array[0].length) {
            right_And_up = true;
        }
        //左下死角检测
        if (y - 1 < 0 && x - 1 < 0) {
            left_And_down = true;
        }
        right_And_up:
        if (!right_And_up) {
            if (y + 1 < grid_array.length && grid_array[y + 1][x].tag === Grid.card) {
                right_And_up = this.ColorIsMatching(SuitPos.rightAndup, self, grid_array[y + 1][x]);
            } else if (y + 1 >= grid_array.length || grid_array[y + 1][x].tag === Grid.obstacle_card) {
                right_And_up = true;
            }
            if (!right_And_up) {
                break right_And_up;
            }
            if (x + 1 < grid_array[0].length && grid_array[y][x + 1].tag === Grid.card) {
                right_And_up = this.ColorIsMatching(SuitPos.rightAndup, self, grid_array[y][x + 1]);
            } else if (x + 1 >= grid_array[0].length || grid_array[y][x + 1].tag === Grid.obstacle_card) {
                right_And_up = true;
            } else {
                right_And_up = false;
            }
        }
        left_And_down:
        if (!left_And_down) {
            if (y - 1 >= 0 && grid_array[y - 1][x].tag === Grid.card) {
                left_And_down = this.ColorIsMatching(SuitPos.leftAnddown, self, grid_array[y - 1][x]);
            } else if (y - 1 < 0 || grid_array[y - 1][x].tag === Grid.obstacle_card) {
                left_And_down = true;
            }
            if (!left_And_down) {
                break left_And_down;
            }
            if (x - 1 >= 0 && grid_array[y][x - 1].tag === Grid.card) {
                left_And_down = this.ColorIsMatching(SuitPos.leftAnddown, self, grid_array[y][x - 1]);
            } else if (x - 1 < 0 || grid_array[y][x - 1].tag === Grid.obstacle_card) {
                left_And_down = true;
            } else {
                left_And_down = false;
            }
        }
        if (right_And_up && left_And_down) {
            let ind = pass_hold_array.indexOf(self);
            if (ind === -1) {
                pass_hold_array.push(self);
                let sum = parseInt(score_count.string) + 50;
                score_count.string = sum + "";
            }
            this.IsShowPass(true, self);
        } else {
            this.IsShowPass(false, self);
        }
    }

    /**
     * 颜色是否匹配
     * @param suit_pos 花色位置
     * @param self 自身节点
     * @param target 目标节点
     */
    private ColorIsMatching(suit_pos: SuitPos, self: cc.Node, target: cc.Node): boolean {
        if (suit_pos === SuitPos.rightAndup) {
            let target_color = target.getComponent(Card).LeftAndDown;
            let self_color = self.getComponent(Card).RightAndUp;
            if (self_color === target_color || target_color === Color.any || self_color === Color.any) {
                return true;
            } else {
                return false;
            }
        }
        if (suit_pos === SuitPos.leftAnddown) {
            let target_color = target.getComponent(Card).RightAndUp;
            let self_color = self.getComponent(Card).LeftAndDown;
            if (self_color === target_color || target_color === Color.any || self_color === Color.any) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * 笑脸是否显示
     * @param isyes 是否通过
     * @param self 自身节点
     */
    private IsShowPass(isyes: boolean, self: cc.Node) {
        self.getComponent(Card).IsPass = isyes;
        self.getChildByName("Front").getChildByName("yes").active = isyes;
        self.getChildByName("Front").getChildByName("no").active = !isyes;
    }
}