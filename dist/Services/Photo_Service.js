"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_Photo = exports.update_Photo = exports.get_Photos = exports.add_Photo = void 0;
const database_1 = __importDefault(require("../Db/database"));
// 插入資料
const add_Photo = (photo) => {
    return new Promise((resolve, reject) => {
        database_1.default.insert(photo, (err, newDoc) => {
            if (err)
                reject(err);
            else
                resolve(newDoc);
        });
    });
};
exports.add_Photo = add_Photo;
// 查詢所有使用者
const get_Photos = () => {
    return new Promise((resolve, reject) => {
        database_1.default.find({}, (err, docs) => {
            if (err)
                reject(err);
            else
                resolve(docs);
        });
    });
};
exports.get_Photos = get_Photos;
// 更新使用者
const update_Photo = (id, updateData) => {
    return new Promise((resolve, reject) => {
        database_1.default.update({ _id: id }, { $set: updateData }, {}, (err, numUpdated) => {
            if (err)
                reject(err);
            else
                resolve(numUpdated);
        });
    });
};
exports.update_Photo = update_Photo;
// 刪除使用者
const delete_Photo = (id) => {
    return new Promise((resolve, reject) => {
        database_1.default.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err)
                reject(err);
            else
                resolve(numRemoved);
        });
    });
};
exports.delete_Photo = delete_Photo;
