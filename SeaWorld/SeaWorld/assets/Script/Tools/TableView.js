/**
 *  creat by Bob
 *  QQ:1020131654 
 * 
 *  功能:模仿ios制作的tableView
 *  Cell可重用
 */

cc.Class({
    extends: cc.Component,

    properties: {
        cellPfb: {
            default: null,
            type: cc.Prefab,
        },
        cellScale:1,
        cellInterval: 0,//间距
        cellHeight: 100,//高度
        cellNumber: 20,//数量
        javaScriptName: "TableView",
        cellJsName: "cell",
    },

    onLoad: function () {
        // this.init();
    },

    //外部调用初始化，出入数据
    init: function (data) {
        //cell
        this.default_cell = cc.instantiate(this.cellPfb);
        this.idx_arr = [];//当前显示几个cell的idx数组
        this.cell_arr = [];//当前显示的cell数组
        this.cell_pool = [];//回收池中的cell数组

        /**
         * 初始化数据
        */
        // this.data = data;
        this.data_arr = data;
        // for (var i = 1; i <= 20; i++) {
        //     this.data_arr.push(i);
        // }

        /*
        *   动态设置基本属性
        */
        // this.cellInterval = 50;
        this.cellHeight = this.default_cell.height;
        this.cellNumber = data.length;

        //添加滚动监听
        this.scrollView = this.getComponent(cc.ScrollView);
        this.content = this.scrollView.content;
        this.content.removeAllChildren();
        this.initScrollViewEvent();

        //设置滚动区域
        this.visibleCellNum = 0;//显示cell的个数
        this.setContenSizeWithCellNumber(this.cellNumber);

        this.initCell();
    },

    initScrollViewEvent: function () {
        //滚动监听
        var scrollViewEventHandler = new cc.Component.EventHandler();
        scrollViewEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        scrollViewEventHandler.component = this.javaScriptName;//这个是代码文件名
        scrollViewEventHandler.handler = "callback";
        scrollViewEventHandler.customEventData = "foobar";
        var scrollview = this.node.getComponent(cc.ScrollView);
        scrollview.scrollEvents.push(scrollViewEventHandler);
    },

    //注意参数的顺序和类型是固定的
    callback: function (scrollview, eventType, customEventData) {
        //这里 scrollview 是一个 Scrollview 组件对象实例
        //这里的 eventType === cc.ScrollView.EventType enum 里面的值
        //这里的 customEventData 参数就等于你之前设置的 "foobar"
        if (eventType == cc.ScrollView.EventType.SCROLLING) {
            var p = scrollview.getScrollOffset();
            var topLine = p.y;
            var bottomLine = p.y + this.node.height;
            // console.log("topLine:"+ topLine + " --bottomLine:"+bottomLine);
            var first_idx = parseInt(topLine / (this.cellHeight + this.cellInterval));
            var last_idx = first_idx + this.visibleCellNum;
            // console.log("top-idx:" + first_idx + "  last_idx:" + (first_idx + this.visibleCellNum));
            if (last_idx > this.cellNumber - 1) {
                last_idx = this.cellNumber - 1;
            }
            // console.log("last_idx:"+last_idx + "  this.cellNumber:"+this.cellNumber);
            if (first_idx >= 0) {
                this.reload(first_idx, last_idx);
            }
        } else if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
            if (this.bottomCallback) {
                this.bottomCallback();
            }

        } else if (eventType == cc.ScrollView.EventType.BOUNCE_TOP) {
            if (this.topCallback) {
                this.topCallback();
            }
        }
    },

    // reloadData(){

    // },

    addItemToTableView(data) {
        this.data_arr = this.data_arr.concat(data);
        this.cellNumber = this.data_arr.length;
        this.setContenSizeWithCellNumber(this.data_arr.length);
    },

    scrollBottomCallback(callback) {
        this.bottomCallback = callback;
    },

    scrollTopCallback(callback) {
        this.topCallback = callback;
    },


    reload: function (first_idx, last_idx) {
        for (var i = 0; i < this.idx_arr.length; i++) {
            var current_idx = this.idx_arr[i];
            // console.log("current_idx:"+current_idx +"--first_idx:"+first_idx + "  last_idx:"+last_idx);
            if (current_idx < first_idx || current_idx > last_idx) {
                this.removeCell(current_idx);
                this.idx_arr.splice(i, 1);
            }
        }
        // console.log(this.idx_arr);
        // console.log(this.cell_arr);

        for (var i = first_idx; i <= last_idx; i++) {
            var tmp = i;
            for (var j = 0; j < this.idx_arr.length; j++) {
                if (this.idx_arr[j] == i) {
                    tmp = -1;
                }
            }
            if (tmp >= 0) {
                this.addCell(tmp);
                this.idx_arr.push(tmp);
            }
        }
        // console.log("this.cell_arr.length:"+this.cell_arr.length);
    },

    /**
    * 设置滚动区域大小
    */
    setContenSizeWithCellNumber: function (num) {
        this.tableHeight = this.cellHeight*this.cellScale + this.cellInterval;
        this.content.height = this.tableHeight * num - this.cellInterval;
        this.visibleCellNum = parseInt(this.node.height / this.tableHeight) + 1;
        // console.log("this.content.height:"+this.content.height);
    },

    /**
    * 设置可视区域大小
    */
    setVisibleSize: function (width, height) {
        this.node.width = width;
        this.node.height = height;
    },

    //初始化cell
    initCell: function () {
        var length = this.visibleCellNum;
        if (this.visibleCellNum > this.cellNumber) {
            length = this.cellNumber;
        }
        for (var i = 0; i < length; i++) {
            var cell = this.getCell();
            var cellJs = cell.getComponent(this.cellJsName);
            cellJs.init(i, this.data_arr[i]);
            cell.x = 0;
            cell.y = -(this.cellHeight*this.cellScale + this.cellInterval) * i;
            this.content.addChild(cell);
            this.idx_arr.push(i);
        }
    },

    //重用或者新建cell
    getCell: function () {
        var cell = null;
        if (this.cell_pool.length == 0) {
            console.log("creat new cell");
            cell = cc.instantiate(this.default_cell);
        } else {
            console.log("recycle old cell");
            cell = this.cell_pool[0];
            this.cell_pool.splice(0, 1);
        }
        this.cell_arr.push(cell);

        // console.log(this.cell_arr);
        // console.log(this.cell_pool);

        return cell;
    },



    //添加cell
    addCell: function (idx) {
        var cell = this.getCell();
        var cellJs = cell.getComponent(this.cellJsName);
        cellJs.init(idx, this.data_arr[idx]);
        cell.x = 0;
        cell.y = -(this.cellHeight + this.cellInterval) * idx;
        console.log('cell.y-------->' + cell.y);
        this.content.addChild(cell);
    },
    clear() {
        if (this.content) {
            this.content.removeAllChildren();
            this.setContenSizeWithCellNumber(0);
            this.node.getComponent(cc.ScrollView).scrollToTop();
        }
    },
    //移除cell
    removeCell: function (idx) {
        for (var i = 0; i < this.cell_arr.length; i++) {
            var cell = this.cell_arr[i];
            var cell_js = cell.getComponent(this.cellJsName);
            // console.log("idx:"+idx + "   cell_js.idx:"+cell_js.idx);
            if (idx == cell_js.idx) {
                this.content.removeChild(cell);
                this.cell_arr.splice(i, 1);
                this.cell_pool.push(cell);
                // console.log("remove: this.cell_arr:"+this.cell_arr.length);
                break;
            }
        }
    },
});
