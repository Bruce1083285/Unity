
cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * @property 旋转节点
         */
        bg_b_rotation: {
            default: null,
            type: cc.Node,
        },

        /**
         * @property 提示页
         */
        Page_Hint: {
            default: null,
            type: cc.Node,
        },

        /**
        * @property 提示页
        */
        Fireworks: {
            default: null,
            type: cc.ParticleSystem,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        this.getData();
    },

    getData() {
        HTTP.sendRequest('Hall/Bag', (res) => {
            if (res.status != 1) {
                GameTools.dialog('请求错误', data.msg, null);
                return;
            }
            this.BindData(res.data);
        }, { uid: DataHelper.Uid });
    },

    BindData(data) {
        // console.log("提升------------------------------------------------2");
        // console.log(data);
        let array = JSON.parse(data.gemplace);
        let num = 0;
        for (let i = 0; i < array.length; i++) {
            let name1 = 'dj_' + (i + 1);
            let name2 = 'item_' + (i + 1);
            let key1 = 'gem' + (i + 1);
            cc.find('content/bottom/' + name1 + '/num', this.node).getComponent(cc.Label).string = data[key1];
            cc.find('content/bg_b/' + name2 + '/dj', this.node).active = array[i] != 0;
            if (array[i] != 0) {
                num++;
            }
        }
        // num = 5;
        if (num == 5) {
            cc.find('content/BT_HC', this.node).active = true;
        } else {
            cc.find('content/BT_HC', this.node).active = false;
        }
        cc.find('content/title/level', this.node).getComponent(cc.Label).string = data.promote;
    },
    CheckButton() {
        let num = 0;
        for (let i = 1; i < 6; i++) {
            let name = 'item_' + i;
            if (cc.find('content/bg_b/' + name + '/dj', this.node).active) {
                num++;
            }
        }
        if (num == 5) {
            cc.find('content/BT_HC', this.node).active = true;
        } else {
            cc.find('content/BT_HC', this.node).active = false;
        }
    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        switch (event.target.name) {
            case 'dj_1':
            case 'dj_2':
            case 'dj_3':
            case 'dj_4':
            case 'dj_5':
                this.TianJia(data);
                break;

            case 'item_1':

                break;
            case 'item_2':

                break;
            case 'item_3':

                break;
            case 'item_4':

                break;
            case 'item_5':

                break;
            case 'BT_HC':
                this.TiSheng();
                // HTTP.sendRequest('Hall/mix', (res) => {
                //     if (res.status != 1) {
                //         GameTools.dialog('请求错误', data.msg, null);
                //         return;
                //     }
                //     console.log("提升------------------------------------------------1");
                //     console.log(res);
                //     this.BindData(res.data);
                //     cc.find('content/title/level', this.node).getComponent(cc.Label).string = res.data.promote;
                // }, { uid: DataHelper.Uid });
                break;
            case "Page_Hint":
                this.Page_Hint.active = false;
                break;
            default:
                break;
        }
    },

    TianJia(id) {
        HTTP.sendRequest('Hall/Place', (res) => {
            if (res.status != 1) {
                GameTools.dialog('请求错误', res.msg, null);
                return;
            }
            this.BindData(res.data);
            cc.find('content/title/level', this.node).getComponent(cc.Label).string = res.data.promote;
            DataHelper.Price_Times = parseInt(res.data.promote);
        }, { uid: DataHelper.Uid, gemid: id });
    },
    // update (dt) {},

    /**
     * 提升
     */
    TiSheng() {
        //关闭宝珠显示
        for (let i = 1; i < 6; i++) {
            let name = 'item_' + i;
            if (cc.find('content/bg_b/' + name + '/dj', this.node).active) {
                cc.find('content/bg_b/' + name + '/dj', this.node).active = false;
            }
        }

        // console.log("旋转节点----------------------------------------------------");
        // console.log(this.bg_b_rotation);
        this.bg_b_rotation.active = true;
        let arr = this.bg_b_rotation.children;
        let arr_pos = [];
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            arr_pos.push(child.position);
            let act_move = cc.moveTo(1, 0, 0);
            child.runAction(act_move);
        }

        let act_rotation = cc.rotateBy(1, 360);
        let act_callback = () => {
            this.Page_Hint.active = true;
            // console.log("粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果粒子效果");
            // console.log(this.Fireworks);
            this.Fireworks.resetSystem();

            this.bg_b_rotation.rotation = 0;
            for (let i = 0; i < arr.length; i++) {
                let child = arr[i];
                child.setPosition(arr_pos[i]);
            }
            this.bg_b_rotation.active = false;

            HTTP.sendRequest('Hall/mix', (res) => {
                if (res.status != 1) {
                    GameTools.dialog('请求错误', data.msg, null);
                    return;
                }
                // console.log("提升------------------------------------------------1");
                // console.log(res);
                this.BindData(res.data);
                cc.find('content/title/level', this.node).getComponent(cc.Label).string = res.data.promote;
            }, { uid: DataHelper.Uid });
        }
        let act_seq = cc.sequence(act_rotation, cc.callFunc(act_callback));
        this.bg_b_rotation.runAction(act_seq);
    },
});
