'use strict';
var copy = require('./copy');
var path = require("path");
var fs = require('fs');
module.exports = {
    load() {
        // 当 package 被正确加载的时候执行
    },

    unload() {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        'start'() {
            // let data = ""
            let proj_path = Editor.projectPath + path.sep + "packages" + path.sep + "initproject" + path.sep + "folder";
            let res_path = Editor.projectPath + path.sep + "assets";
            let exists = fs.existsSync(res_path + path.sep + 'Scene');
            if (exists) {
                return;
            }
            // Editor.log(_Scene);
            copy.copy(proj_path, res_path);
            Editor.assetdb.refresh('db://assets/', null);
            // Editor.assetdb.create( 'db://assets/foobar.js', 'let a = 1;', function (err, results){

            // });
            // Editor.assetdb.create('db://assets/bar.js', null, function (err, results) {
            //     Editor.assetdb.refresh('db://assets/', null);
            // });
        }
    },
};