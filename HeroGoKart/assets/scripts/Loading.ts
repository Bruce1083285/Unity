// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
    }

    start () {

    }

    // update (dt) {}

    // preloadScene(_This, sceneName, onLoaded, onProgress){
    //     let director = cc.director;
    //     let info = director._getSceneUuid(sceneName);
    //     if (info) {
    //         director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
    //         cc.loader.load({
    //             uuid: info.uuid,
    //             type: "uuid"
    //         }, null == onProgress ? null : function (e, a) {
    //             onProgress && onProgress.call(_This, e, a);
    //         }, function (error, asset) {
    //             error && cc.errorID(1215, sceneName, error.message);
    //             onLoaded && onLoaded(error, asset);
    //         });
    //     } else {
    //         var error = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
    //         onLoaded && onLoaded(new Error(error));
    //         cc.error("preloadScene: " + error);
    //     }
    // }
}
