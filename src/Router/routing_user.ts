import express, { Request, Response } from 'express';
import Datastore from 'nedb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User_Model } from '../Models/User_Model'; // 新增這行
dotenv.config();

const router = express.Router();
const db = new Datastore({  filename: 'dbStorage/users.db', autoload: true });
const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 用戶管理
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: 註冊新用戶
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: 用戶註冊成功
 *       500:
 *         description: 伺服器錯誤
 */
router.post('/register', (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send(err);
        const newUser: User_Model = {
            username: username,
            password: hash,
            email: email || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        db.insert(newUser, (err, insertedUser) => {
            if (err) return res.status(500).send(err);
            res.status(201).send(insertedUser);
        });
    });
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: 用戶登入
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: 登入成功，返回 JWT token
 *       401:
 *         description: 密碼錯誤
 *       404:
 *         description: 用戶不存在
 *       500:
 *         description: 伺服器錯誤
 */
router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    db.findOne({ username }, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send('User not found');
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).send(err);
            if (!result) return res.status(401).send('Invalid password');
            const token = jwt.sign({ id: user._id , username : user.username }, secretKey, { expiresIn: '3m' });
            res.status(200).send({ token });
        });
    });
});

/**
 * @swagger
 * /api/user/edit:
 *   put:
 *     summary: 編輯用戶信息
 *     tags: [Users]
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
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
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
    const token = req.headers['authorization'];
    if (!token) { 
        res.status(401).send('No token provided'); 
    }
    jwt.verify(token!, secretKey, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token 2');
        if (typeof decoded === 'string' || !decoded) return res.status(500).send('Invalid token');
        const { username, password,email } = req.body;
        // 取得登入者的部分資訊
        const userId = (decoded as JwtPayload).id;
        console.log("username: ", username);
        console.log("password: ", password);
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).send(err);
            db.update({ _id: (decoded as JwtPayload).id }, { $set: { username, password: hash , email, } }, {}, (err, numReplaced) => {
                if (err) return res.status(500).send(err);
                res.status(200).send('User updated2');
            });
        });
    });
});

export default router;
