
cc.Class({
    extends: cc.Component,

    properties: {

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
                HTTP.sendRequest('Hall/mix', (res) => {
                    if (res.status != 1) {
                        GameTools.dialog('请求错误', data.msg, null);
                        return;
                    }
                    this.BindData(res.data);
                    cc.find('content/title/level', this.node).getComponent(cc.Label).string = res.data.promote;
                }, { uid: DataHelper.Uid });
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
});
