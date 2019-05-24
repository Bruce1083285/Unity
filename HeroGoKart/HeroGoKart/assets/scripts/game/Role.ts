import Game from "../Game";

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
export default class Role extends cc.Component {

  /**
   * @property 加速最大值
   */
  public Speed_Max: number = 1000;
  /**
     * @property 移动速度
     */
  public Speed: number = 0;
  /**
 * @property 灵敏度
 */
  public Horizontal_Sensitivity: number = 100;
  /**
 * @property 当前速度值
 */
  public Current_SpeedValue: number = 0;
  /**
   * @property 保护罩是否开启
   */
  public IsOpen_Pretection: boolean = false;
  /**
   * @property 水平移动开关
   */
  public IsHorizontal: boolean = true;
  /**
   * @property 是否正在减速
   */
  public IsSlowDown: boolean = false;
  /**
   * @property 是否加速
   */
  public IsSpeedUp: boolean = true;
  /**
   * @property 是否正在加速
   */
  public IsSpeedUping: boolean = false;
  /**
   * @property 是否被水泡困住
   */
  public IsWaterPolo: boolean = false;
  /**
  * @property 是否被冰冻
  */
  public IsFrozen: boolean = false;
  /**
  * @property 是否被雷击
  */
  public IsLightning: boolean = false;
  /**
   * @property 是否存在定时炸弹
   */
  public TimeBomb: cc.Node = null;
  /**
   * @property 是否在空中
   */
  public IsSky: boolean = false;
  /**
   * @property 游戏类
   */
  public Game: Game = null;


  // onLoad () {}

  start() {

  }

  // update (dt) {}

  /**
   * 获取保护罩
   * @returns 保护罩是否打开
   */
  public GetPretection(target: cc.Node): boolean {
    return
  }

  /**
* 重置自身
*/
  public ResetSelf() { }
  
  /**
   * 左右移动
   * @param ratio 比例
   */
  public Move(ratio: number) { }
}
