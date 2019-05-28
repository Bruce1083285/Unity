import { GameManager } from "../../commont/GameManager";

/**
 * @class 备用方块类
 */
export class Standby {

    /**
     * 更新备用区域方块
     * @param area_Standby 备用方块区域
     * @param sprf_standbyCubes 备用方块精灵帧
     */
    public UpdateStandby(area_Standby: cc.Node, sprf_standbyCubes: cc.SpriteFrame[]) {
        let arr_standbyC: cc.SpriteFrame[] = [];
        let arr_chi: cc.Node[] = area_Standby.children;
        //获取备用待机区域备用方块的精灵帧
        for (let i = 0; i < arr_chi.length; i++) {
            let chi = arr_chi[i];
            let spr_chi = chi.getComponent(cc.Sprite);
            if (spr_chi.spriteFrame) {
                arr_standbyC.push(spr_chi.spriteFrame);
            }
        }

        //备用待机区备用方块是否已满
        if (arr_standbyC.length >= arr_chi.length) {
            return;
        }

        //缺口长度
        let length: number = arr_chi.length - arr_standbyC.length;
        //补充缺口方块精灵帧
        for (let i = 0; i < length; i++) {
            let ran = Math.floor(Math.random() * sprf_standbyCubes.length);
            let spr_Frame = sprf_standbyCubes[ran];
            arr_standbyC.push(spr_Frame);
        }

        //重新赋值子节点
        for (let i = 0; i < arr_chi.length; i++) {
            let chi = arr_chi[i];
            let spr_Frame = arr_standbyC[i];
            let spr_chi = chi.getComponent(cc.Sprite);
            spr_chi.spriteFrame = spr_Frame;
        }

        //每次更新记录备用区域第一个方块ID
        GameManager.Instance.Standby_FirstID = arr_standbyC[0].name;
    }
}
