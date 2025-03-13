"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_Photo = exports.update_Photo = exports.get_Photos = exports.add_Photo = void 0;
var database_1 = require("../Db/database");
// 插入資料
var add_Photo = function (photo) {
    return new Promise(function (resolve, reject) {
        database_1.default.insert(photo, function (err, newDoc) {
            if (err)
                reject(err);
            else
                resolve(newDoc);
        });
    });
};
exports.add_Photo = add_Photo;
// 查詢所有使用者
var get_Photos = function () {
    return new Promise(function (resolve, reject) {
        database_1.default.find({}, function (err, docs) {
            if (err)
                reject(err);
            else
                resolve(docs);
        });
    });
};
exports.get_Photos = get_Photos;
// 更新使用者
var update_Photo = function (id, updateData) {
    return new Promise(function (resolve, reject) {
        database_1.default.update({ _id: id }, { $set: updateData }, {}, function (err, numUpdated) {
            if (err)
                reject(err);
            else
                resolve(numUpdated);
        });
    });
};
exports.update_Photo = update_Photo;
// 刪除使用者
var delete_Photo = function (id) {
    return new Promise(function (resolve, reject) {
        database_1.default.remove({ _id: id }, {}, function (err, numRemoved) {
            if (err)
                reject(err);
            else
                resolve(numRemoved);
        });
    });
};
exports.delete_Photo = delete_Photo;
