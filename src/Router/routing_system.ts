import express, { Request, Response } from 'express';
import Datastore from 'nedb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User_Model } from '../Models/User_Model'; // 新增這行
import { exec } from 'child_process'; // 新增這行
import os from 'os'; // 新增這行
dotenv.config();
const router = express.Router();

/*
* @swagger
* tags:
*   - name: System
*     description: 系統資訊 API
*/

/**
 * @swagger
 * /api/system/disk/info:
 *   get:
 *     summary: 獲取磁碟資訊
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 成功獲取磁碟資訊
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       disk:
 *                         type: string
 *                         description: 磁碟名稱
 *                       totalSpace:
 *                         type: string
 *                         description: 總空間
 *                       usedSpace:
 *                         type: string
 *                         description: 已使用空間
 *                       usageRate:
 *                         type: string
 *                         description: 使用率
 *       500:
 *         description: 獲取磁碟資訊失敗
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 錯誤訊息
 */

router.get('/disk/info', (req: Request, res: Response) => {
    const platform = os.platform();
    const command = platform === 'win32' ? 'wmic logicaldisk get size,freespace,caption' : 'df -h';
    // TODO: 加入 JWT 的驗證
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to get disk info' });
        }
        if (platform === 'win32') {
            const lines = stdout.trim().split('\n');
            const disks = lines.slice(1).map(line => {
                const diskInfo = line.trim().split(/\s+/);
                const totalSpace = (parseInt(diskInfo[2]) / (1024 ** 3)).toFixed(2) + 'G';
                const usedSpace = ((parseInt(diskInfo[2])-parseInt(diskInfo[1]))  / (1024 ** 3)).toFixed(2) + 'G';
                const usageRate = (((parseInt(diskInfo[2])-parseInt(diskInfo[1])) / parseInt(diskInfo[2]))*100).toFixed(2) + '%';
                return { disk_name: diskInfo[0], totalSpace, usedSpace, usageRate };
            });
            res.json({ disks });
        } else {
            const lines = stdout.trim().split('\n');
            const disks = lines.slice(1).map(line => {
                const diskInfo = line.split(/\s+/);
                const totalSpace = diskInfo[1];
                const usedSpace = diskInfo[2];
                const usageRate = diskInfo[4];
                return { disk_name: diskInfo[0], totalSpace, usedSpace, usageRate };
            });
            res.json({ disks });
        }
    });
});

export default router;
