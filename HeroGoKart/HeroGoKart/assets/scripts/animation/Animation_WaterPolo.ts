import AI from "../game/AI";
import Player from "../game/Player";
import { GameManage } from "../commont/GameManager";
import { Special_Car, SoundType, EventType } from "../commont/Enum";
import { EventCenter } from "../commont/EventCenter";
import Role from "../game/Role";

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
export default class Animation_WaterPolo extends cc.Component {

    /**
     * @property 目标节点
     */
    private Target: cc.Node = null;
    /**
     * @property 动画播放组件
     */
    private Animat: cc.Animation = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
        if (!this.Target || GameManage.Instance.IsPause) {
            return;
        }

        let num = this.node.position.sub(this.Target.position).mag();
        let dis = Math.abs(num);
        if (dis <= 10) {
            EventCenter.BroadcastOne(EventType.Sound, SoundType.WaterPolo);
            GameManage.Instance.Page_Alarm.stopAllActions();
            GameManage.Instance.Page_Alarm.active = false;
            let arr_car = this.Target.getChildByName("Box").getChildByName("SpecialCar").children;
            let car_name: string = null;
            for (let i = 0; i < arr_car.length; i++) {
                let car = arr_car[i];
                if (car.active) {
                    car_name = car.name;
                    break;
                }
            }
            if (car_name && car_name === Special_Car.Pickup) {
                this.node.destroy();
                return;
            }

            let arr = this.Target.children;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name === "6") {
                    arr[i].destroy();
                    this.node.destroy();
                    return;
                }
            }

            let box = this.Target.getChildByName("Box");
            box.stopAllActions();
            box.scale = 1;

            GameManage.Instance.IsUseingProp = false;

            let type_Class: Role = null;
            let name = this.Target.name;
            if (name === "AI") {
                type_Class = this.Target.getComponent(AI);
                let istrue = type_Class.GetPretection(this.node);
                if (istrue) {
                    return
                }
            } else if (name === "Player") {
                type_Class = this.Target.getComponent(Player);
                let istrue = type_Class.GetPretection(this.node);
                if (istrue) {
                    return
                }
                GameManage.Instance.IsTouchClick = false;
                type_Class.Game.Horizontal = 0;
            }
            type_Class.IsWaterPolo = true;
            type_Class.IsSpeedUp = false;
            type_Class.Speed = 0;
            // this.node.removeFromParent(false);
            // this.Target.addChild(this.node);
            // this.node.setPosition(0, 0);
            this.node.opacity = 200;
            this.node.scale = 1.5;
            this.Animat.stop();
            let img = this.node.getChildByName("img");
            img.scale = 1;
            let target = this.Target;
            let callback = () => {
                GameManage.Instance.IsUseingProp = true;

                let collider = target.getComponent(cc.BoxCollider);
                collider.enabled = true;

                let type_Class = null;
                let name = target.name;
                if (name === "AI") {
                    type_Class = target.getComponent(AI);
                } else if (name === "Player") {
                    type_Class = target.getComponent(Player);
                    GameManage.Instance.IsTouchClick = true;
                }
                type_Class.IsWaterPolo = false;
                type_Class.IsSpeedUp = true;
                type_Class.Speed = 0;
                this.node.destroy();
            }
            this.scheduleOnce(callback, 2);
            this.Target = null;
            return;
        }

        let x = this.Target.position.x - this.node.position.x;
        let y = this.Target.position.y - this.node.position.y;
        let dirVec = cc.v2(x, y);    // 方向向量
        let radian = this.node.position.signAngle(dirVec);    // 求弧度
        let degree = cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
        let _dir = cc.v2(this.Target.position.x - this.node.position.x, this.Target.position.y - this.node.position.y);
        degree = (Math.atan2(_dir.y, _dir.x) / Math.PI * 180);

        // 由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
        let angle_1 = degree / 180 * Math.PI;
        // let angle_1 = radian;
        //合成基于 X正方向的方向向量
        let dir_1 = cc.v2(Math.cos(angle_1), Math.sin(angle_1));
        //单位化向量
        dir_1.normalizeSelf();

        //根据方向向量移动位置
        let moveSpeed = 2000;
        this.node.x += dt * dir_1.x * moveSpeed;
        this.node.y += dt * dir_1.y * moveSpeed;
        // let v2 = this.node.position.lerp(this.Target.position, 0.5, this.node.position);
        // this.node.setPosition(v2.x, v2.y);
    }

    /**
     * 初始化
     */
    Init() {
        this.Animat = this.node.getComponent(cc.Animation);

    }

    /**
     * 播放
     * @param target 目标节点
     */
    public Play(target: cc.Node) {
        // let collider = target.getComponent(cc.BoxCollider);
        // collider.enabled = false;

        if (target.name === "Player") {
            let act_fOut = cc.fadeOut(0.2);
            let act_fIn = cc.fadeIn(0.2);
            let act_seq = cc.sequence(act_fOut, act_fIn).repeatForever();
            GameManage.Instance.Page_Alarm.active = true;
            GameManage.Instance.Page_Alarm.runAction(act_seq);
        }

        this.Target = target;
        this.Animat.play();
    }
}
