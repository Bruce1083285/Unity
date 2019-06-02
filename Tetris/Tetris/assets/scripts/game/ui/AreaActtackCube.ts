import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { GameManager } from "../../commont/GameManager";

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
export default class AreaActtackCube extends cc.Component {

    /**
     * @property 攻击方块预制体
     */
    @property(cc.Prefab)
    private Pre_Acttack_Cube: cc.Prefab = null;
    /**
    * @property 攻击方块预制体
    */
    @property(cc.Prefab)
    private Pre_Explode: cc.Prefab = null;

    onLoad() {
        // this.SetActtackCube(5);
        this.AddListenter();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //设置攻击方块
        EventCenter.AddListenter(EventType.SetActtackCube, (num: number) => {
            this.SetActtackCube(num);
        }, "AreaActtackCube");

        //销毁攻击方块
        EventCenter.AddListenter(EventType.DestoryAllActtackCube, () => {
            this.DestoryAllActtackCube();
        }, "AreaActtackCube");

        //通过连消数销毁攻击方块
        EventCenter.AddListenter(EventType.DestoryActtackCubeByNum, (num: number) => {
            this.DestoryActtackCubeByNum(num);
        }, "AreaActtackCube");


        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "AreaActtackCube");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //设置攻击方块
        EventCenter.RemoveListenter(EventType.SetActtackCube, "AreaActtackCube");

        //销毁攻击方块
        EventCenter.RemoveListenter(EventType.DestoryAllActtackCube, "AreaActtackCube");

        //通过连消数销毁攻击方块
        EventCenter.RemoveListenter(EventType.DestoryActtackCubeByNum, "AreaActtackCube");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "AreaActtackCube");
    }

    /**
     * 设置攻击方块
     * @param num 攻击方块数
     */
    private SetActtackCube(num: number) {
        //先销毁现有攻击方块
        this.DestoryNowActtackCube();

        GameManager.Instance.ActtackCube_Num += num;
        this.CreatroNowActtackCube();

    }

    /**
     * 通过连消数销毁攻击方块
     * @param num 连消数
     */
    private DestoryActtackCubeByNum(num: number) {
        if (num <= 0) {
            return;
        }
        //先销毁现有攻击方块
        this.DestoryNowActtackCube();

        GameManager.Instance.ActtackCube_Num -= num;
        this.CreatroNowActtackCube();
    }

    /**
     * 销毁现有攻击方块
     */
    private DestoryNowActtackCube() {
        let arr: cc.Node[] = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            arr[i].destroy();
        }
    }

    /**
     * 创建现有方块
     */
    private CreatroNowActtackCube() {
        for (let i = 0; i < GameManager.Instance.ActtackCube_Num; i++) {
            let cube = cc.instantiate(this.Pre_Acttack_Cube);
            this.node.addChild(cube);
            let height = cube.getContentSize().height;
            cube.setPosition(0, i * height + height / 2);

            let explode = cc.instantiate(this.Pre_Explode);
            explode.active = false;
            this.node.addChild(explode);
            explode.setPosition(0, i * height + height / 2);

            let gray = cube.getChildByName("gray");
            gray.active = true;
            let red = cube.getChildByName("red");
            red.active = false;
            let callback = () => {
                explode.active = true;
                gray.active = false;
                red.active = true;
            }
            this.schedule(callback, 1);
        }
    }

    /**
     * 销毁所有攻击方块
     */
    private DestoryAllActtackCube() {
        let arr: cc.Node[] = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            arr[i].destroy();
        }
    }
}
