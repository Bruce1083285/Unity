import { EventType, SoundType, Special_Car } from "../commont/Enum";
import { EventCenter } from "../commont/EventCenter";
import { GameManage } from "../commont/GameManager";

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
export default class Animation_Bomb extends cc.Component {

    /**
     * @property 导弹精灵帧
     */
    @property([cc.SpriteFrame])
    private Bomb_Skins: cc.SpriteFrame[] = [];
    /**
     * @property 目标节点
     */
    private Target: cc.Node = null;
    /**
     * @property 图片精灵组件
     */
    private Sprite_Img: cc.Sprite = null;
    /**
     * @property 下标索引
     */
    private Index: number = 0;
    /**
    * @property 水平移动值   -1：左  0：不变  1：右
    */
    private Horizontal: number = 0;

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
        if (!this.Target) {
            return;
        }
        let target_x = this.Target.position.x;
        let start_x = this.node.position.x;
        if (target_x < start_x) {
            this.Horizontal = -1;
        }
        if (target_x > start_x) {
            this.Horizontal = 1;
        }
        let num = this.node.position.sub(this.Target.position).mag();
        let dis = Math.abs(num);
        if (dis < 100) {
            let car_name = GameManage.Instance.Current_SpecialCar ? GameManage.Instance.Current_SpecialCar.name : null;
            if (car_name && car_name === Special_Car.Pickup) {
                this.node.destroy();
                return;
            }
            EventCenter.BroadcastOne(EventType.Sound, SoundType.Bomb);
            this.node.destroy();
            let collider = this.Target.getComponent(cc.BoxCollider);
            collider.enabled = false;
            let name = this.Target.name;
            let type_Class = null;
            if (name === "AI") {
                type_Class = this.Target.getComponent("AI");
            } else if (name === "Player") {
                type_Class = this.Target.getComponent("Player");
            }

            type_Class.IsSpeedUp = false;
            type_Class.Speed = 0;
            let act_Scale_big = cc.scaleTo(1, 0.6);
            let act_Rotate = cc.rotateTo(1, 1080);
            let act_Spawn = cc.spawn(act_Scale_big, act_Rotate);
            let act_Scale_small = cc.scaleTo(0.3, 0.4);
            let act_callback = () => {
                collider.enabled = true;
                type_Class.IsSpeedUp = true;
                type_Class = 0;
            }
            let act_Seq = cc.sequence(act_Spawn, act_Scale_small, cc.callFunc(act_callback));
            this.Target.runAction(act_Seq);
            this.Target = null;
            return;
        }
        // let self_y = this.node.position.y + 20;
        // let self_x = this.node.position.x + 20 * this.Horizontal;
        // this.node.setPosition(self_x, self_y);
        // let x = this.Target.position.x - this.node.position.x;
        // let y = this.Target.position.y - this.node.position.y;
        // let v=this.Target.position.sub(this.node.position);
        // let dirVec = cc.v2(x, y);    // 方向向量
        // let radian = this.node.position.signAngle(v);    // 求弧度
        // let degree = cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
        // // //将弧度转换为欧拉角
        // // let degree = radian / Math.PI * 180;
        // this.node.rotation = -degree;
        // // this.node.position.lerp(this.Target.position,degree);

        // // //计算出朝向
        // let dx = this.Target.x - this.node.position.x;
        // let dy = this.Target.y - this.node.position.y;
        // let dir_2 = cc.v2(dx, dy);
        // let v = this.Target.position.sub(this.node.position);
        // //根据朝向计算出夹角弧度
        // let angle_2 = v.signAngle(cc.v2(1, 0));

        // //将弧度转换为欧拉角
        // let degree = angle_2 / Math.PI * 180;

        // //赋值给节点
        // this.node.rotation = -degree;



        // let _dir = cc.v2(this.Target.position.x - this.node.position.x, this.Target.position.y - this.node.position.y);
        // // degree = -1 * (Math.atan2(_dir) / Math.PI * 180)
        // degree = (Math.atan2(_dir.y, _dir.x) / Math.PI * 180);
        // // this.node.rotation = degree;



        // // 由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
        // let angle_1 = degree / 180 * Math.PI;
        // // let angle_1 = radian;
        // //合成基于 X正方向的方向向量
        // let dir_1 = cc.v2(Math.cos(angle_1), Math.sin(angle_1));
        // //单位化向量
        // dir_1.normalizeSelf();

        // //根据方向向量移动位置
        // let moveSpeed = 500;
        // this.node.x += dt * dir_1.x * moveSpeed;
        // this.node.y += dt * dir_1.y * moveSpeed;
        // // this.node.x += dir_1.x * moveSpeed;
        // // this.node.y += dir_1.y * moveSpeed;

        // // degree = - Math.atan((currentPos.y - this.lastPosition.y) / (currentPos.x - this.lastPosition.x)) * 180 / 3.14;


        // console.log(this.node);
        let v2 = this.node.position.lerp(this.Target.position, 0.1, this.node.position);
        this.node.setPosition(v2.x, v2.y);
    }

    /**
     * 初始化
     */
    Init() {
        this.Sprite_Img = this.node.getChildByName("img").getComponent(cc.Sprite);
        this.schedule(() => {
            this.Play();
        }, 0.1);
    }

    /**
     * 设置目标节点
     * @param target 目标节点
     * @param start_node 发射节点
     */
    public SetTarget(target: cc.Node) {
        this.node.rotation = 0;
        this.Target = target;
    }

    /**
     * 播放动画
     */
    private Play() {
        this.Sprite_Img.spriteFrame = this.Bomb_Skins[this.Index]
        this.Index++;
        if (this.Index >= this.Bomb_Skins.length) {
            this.Index = 0;
        }
    }
}
