import express, { Request, Response } from 'express';
import Datastore from 'nedb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Album_Model } from '../Models/Album_Model'; // 新增這行
dotenv.config();

const router = express.Router();
const db = new Datastore({ filename: 'dbStorage/album.db', autoload: true });
const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

/**
 * @swagger
 * tags:
 *   name: Album
 *   description: 相簿管理
 */

/**
 * @swagger
 * /api/album/edit:
 *   put:
 *     summary: 編輯相片信息
 *     tags: [Album]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - photo_name
 *               - photo_desc
 *               - photo_order
 *             properties:
 *               _id:
 *                 type: string
 *               photo_name:
 *                 type: string
 *               photo_desc:
 *                 type: string
 *               photo_order:
 *                 type: number
 *               defalut_photo_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: 相片信息更新成功
 *       404:
 *         description: 找不到用戶
 *       500:
 *         description: 伺服器錯誤
 */
router.put('/edit', (req: Request, res: Response) => {
    const { photo_name, photo_desc, photo_order, _id,defalut_photo_url } = req.body;

    db.findOne(({ _id }), (err, album) => {
        if (err) return res.status(500).send("Album not found");
        if (album) {
            db.update({ _id }, { $set: { photo_name, photo_desc, photo_order,defalut_photo_url, photo_updateAt: new Date() } }, {}, (err, numReplaced) => {
                res.json({ status: "ok", message: 'update success' });
            });
        } else {
            res.status(404).send('Album not found');
        }
    });

});

/**
 * @swagger
 * /api/album/keyword/{keyword}:
 *   get:
 *     summary: 根據關鍵字搜尋相片
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: 關鍵字
 *     responses:
 *       200:
 *         description: 搜尋結果
 *       500:
 *         description: 伺服器錯誤
 */
router.get('/keyword/:keyword?', (req: Request, res: Response) => {
    let keyword = req.params.keyword || '';
    if (keyword == '{keyword}') {
        keyword = '';
    }

    db.find({
        $or: [
            { photo_name: new RegExp(keyword, 'i') },
            { photo_desc: new RegExp(keyword, 'i') }
        ]
    }, (err: any, albums: any) => {
        if (err) return res.status(500).send(err);
        res.json(albums);
    });
});

/**
 * @swagger
 * /api/album/{_id}:
 *   get:
 *     summary: 根據ID取得相片信息
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 相片ID
 *     responses:
 *       200:
 *         description: 相片信息
 *       404:
 *         description: 找不到相片
 *       500:
 *         description: 伺服器錯誤
 */
router.get('/:_id', (req: Request, res: Response) => {
    let _id = req.params._id || '';
    db.findOne({ _id }, (err: any, user: any) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    });
});

/**
 * @swagger
 * /api/album/delete_by_id/{_id}:
 *   delete:
 *     summary: 根據ID刪除相片
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 相片ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *       500:
 *         description: 伺服器錯誤
 */
router.delete('/delete_by_id/:_id', (req: Request, res: Response) => {
    let _id = req.params._id || '';
    db.remove({ _id }, {}, (err: any, numRemoved: any) => {
        res.json({ status: "ok", message: 'delete success' });
    });
});

/**
 * @swagger
 * /api/album/register:
 *   post:
 *     summary: 註冊新相片
 *     tags: [Album]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photo_name
 *               - photo_desc
 *               - photo_order
 *             properties:
 *               photo_name:
 *                 type: string
 *               photo_desc:
 *                 type: string
 *               photo_order:
 *                 type: number
 *               defalut_photo_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: 相片註冊成功
 *       500:
 *         description: 伺服器錯誤
 */
router.post('/register', (req: Request, res: Response) => {
    const { photo_name, photo_desc, photo_order,defalut_photo_url } = req.body;

    const newAlbum: Album_Model = {
        photo_name: photo_name,
        photo_desc: photo_desc,
        photo_order: photo_order,
        photo_updateAt: new Date(),
        defalut_photo_url: defalut_photo_url
    };
    db.insert(newAlbum, (err, insertedAlbum) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(insertedAlbum);
    });
});

export default router;
