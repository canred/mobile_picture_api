import db from '../Db/database.js';
import { Photo_Model } from '../Models/Photo_Model';

// 插入資料
export const add_Photo = (photo: Photo_Model): Promise<Photo_Model> => {
    return new Promise((resolve, reject) => {
        db.insert(photo, (err, newDoc) => {
            if (err) reject(err);
            else resolve(newDoc);
        });
    });
};

// 查詢所有使用者
export const get_Photos = (): Promise<Photo_Model[]> => {
    return new Promise((resolve, reject) => {
        db.find({}, (err:any, docs:any) => {
            if (err) reject(err);
            else resolve(docs);
        });
    });
};

// 更新使用者
export const update_Photo= (id: string, updateData: Partial<Photo_Model>): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.update({ _id: id }, { $set: updateData }, {}, (err, numUpdated) => {
            if (err) reject(err);
            else resolve(numUpdated);
        });
    });
};

// 刪除使用者
export const delete_Photo = (id: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) reject(err);
            else resolve(numRemoved);
        });
    });
};
