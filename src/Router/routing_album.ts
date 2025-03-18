import express, { Request, Response } from 'express';
import Datastore from 'nedb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User_Model } from '../Models/User_Model'; // 新增這行
dotenv.config();

const router = express.Router();
const db = new Datastore({ filename: 'dbStorage/album.db', autoload: true });
const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

/**
 * @swagger
 * tags:
 *   name: album
 *   description: 相簿管理
 */


/**
 * @swagger
 * /api/album/edit:
 *   put:
 *     summary: 編輯用戶信息
 *     tags: [album]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 用戶信息更新成功
 *       401:
 *         description: 未提供 token
 *       500:
 *         description: 伺服器錯誤
 */
router.put('/edit', (req: Request, res: Response) => {
    // const token = req.headers['authorization'];
    // if (!token) {
    //     res.status(401).send('No token provided');
    // }
    // jwt.verify(token!, secretKey, (err, decoded) => {
    //     if (err) return res.status(500).send('Failed to authenticate token 2');
    //     if (typeof decoded === 'string' || !decoded) return res.status(500).send('Invalid token');
    const { username, email, _id } = req.body;

    // username: string;
    // password: string;
    // email?: string;
    // createdAt: Date;
    // updatedAt: Date;

    // 取得登入者的部分資訊
    // const userId = (decoded as JwtPayload).id;
    db.findOne(({ _id }), (err, user) => {
        if (err) return res.status(500).send("User not found");
        if (user) {
            db.update({ _id }, { $set: { username, email, updatedAt: new Date() } }, {}, (err, numReplaced) => {
                res.json({ status: "ok", message: 'update success' });
            });
        } else {
            res.status(404).send('User not found');
        }
    });
    
});

/**
 * @swagger
 * /api/album/keyword/{keyword}:
 *   get:
 *     summary: 根據關鍵字搜尋用戶
 *     tags: [album]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: 用戶名關鍵字
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

    db.find({ username: new RegExp(keyword, 'i') }, (err: any, users: any) => {
        users.forEach((user: any) => {
            delete user.password;
        });
        res.json(users);
    });
});

/**
 * @swagger
 * /api/album/{_id}:
 *   get:
 *     summary: 根據用戶ID獲取用戶信息
 *     tags: [album]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 用戶ID
 *     responses:
 *       200:
 *         description: 用戶信息
 *       404:
 *         description: 用戶不存在
 *       500:
 *         description: 伺服器錯誤
 */
router.get('/:_id', (req: Request, res: Response) => {
    let _id = req.params._id || '';
    db.findOne({ _id }, (err: any, user: any) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send('User not found');
        delete user.password;
        res.json(user);
    });
});

/**
 * @swagger
 * /api/album/delete_by_id/{_id}:
 *   delete:
 *     summary: 刪除用戶
 *     tags: [album]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 用戶ID
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

//http://localhost:3001/api/user/UC5quDst4zgZLwBf

//http://localhost:3001/api/user/keyword/
export default router;
