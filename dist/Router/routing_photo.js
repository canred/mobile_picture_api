"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const service_photo = __importStar(require("../Services/Photo_Service"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    },
});
const upload = (0, multer_1.default)({ storage });
/**
 * @swagger
 * /api/photo/get:
 *   get:
 *     summary: Retrieve a list of photos
 *     responses:
 *       200:
 *         description: A list of photos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   url:
 *                     type: string
 *                     example: "http://example.com/photo.jpg"
 */
// Define a route for getting all photos
router.get('/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic to get all photos
    let all_photo = yield service_photo.get_Photos();
    res.json(all_photo);
}));
/**
 * @swagger
 * /api/photo/getClassType:
 *   get:
 *     summary: Retrieve a list of distinct class types
 *     responses:
 *       200:
 *         description: A list of distinct class types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "landscape"
 */
router.get('/getClassType', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let all_photo = yield service_photo.get_Photos();
        let classTypes = [...new Set(all_photo.map(photo => photo.class_type).filter(classType => classType !== null && classType !== undefined))];
        res.json(classTypes);
    }
    catch (error) {
        res.status(500).send('Error retrieving class types');
    }
}));
/**
 * @swagger
 * /api/photo/search/{keyword}:
 *   get:
 *     summary: Search photos by keyword
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: The keyword to search for
 *     responses:
 *       200:
 *         description: A list of photos matching the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   url:
 *                     type: string
 *                     example: "http://example.com/photo.jpg"
 *                   tags:
 *                     type: string
 *                     example: "nature, landscape"
 *                   description:
 *                     type: string
 *                     example: "A beautiful landscape photo"
 */
router.get('/search/:keyword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.params.keyword.toLowerCase();
    try {
        let all_photo = yield service_photo.get_Photos();
        if (keyword === 'all') {
            res.json(all_photo);
            return;
        }
        else {
            let filtered_photos = all_photo.filter((photo) => photo.tags.toLowerCase().includes(keyword) ||
                photo.description.toLowerCase().includes(keyword));
            res.json(filtered_photos);
        }
    }
    catch (error) {
        res.status(500).send('Error searching photos');
    }
}));
/**
 * @swagger
 * /api/photo/search/{classType}/{keyword}:
 *   get:
 *     summary: Search photos by class type and keyword
 *     parameters:
 *       - in: path
 *         name: classType
 *         required: true
 *         schema:
 *           type: string
 *         description: The class type to filter by
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: The keyword to search for
 *     responses:
 *       200:
 *         description: A list of photos matching the class type and keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   url:
 *                     type: string
 *                     example: "http://example.com/photo.jpg"
 *                   class_type:
 *                     type: string
 *                     example: "landscape"
 *                   tags:
 *                     type: string
 *                     example: "nature, landscape"
 *                   description:
 *                     type: string
 *                     example: "A beautiful landscape photo"
 */
router.get('/search/:calssType/:keyword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.params.keyword.toLowerCase();
    try {
        let all_photo = yield service_photo.get_Photos();
        if (keyword === 'all') {
            let filtered_photos = all_photo.filter((photo) => photo.class_type === req.params.calssType);
            filtered_photos.sort((a, b) => {
                return b.upload_datetime.getTime() - a.upload_datetime.getTime();
            });
            res.json(filtered_photos);
            return;
        }
        else {
            let filtered_photos = all_photo.filter((photo) => photo.class_type === req.params.calssType &&
                photo.tags.toLowerCase().includes(keyword) ||
                photo.description.toLowerCase().includes(keyword));
            filtered_photos.sort((a, b) => {
                return b.upload_datetime.getTime() - a.upload_datetime.getTime();
            });
            res.json(filtered_photos);
        }
    }
    catch (error) {
        res.status(500).send('Error searching photos');
    }
}));
/**
 * @swagger
 * /api/photo/add:
 *   post:
 *     summary: Add a new photo
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               class_type:
 *                 type: string
 *                 required: true
 *                 example: "class one"
 *               tags:
 *                 type: string
 *                 example: "nature, landscape"
 *               description:
 *                 type: string
 *                 example: "A beautiful landscape photo"
 *     responses:
 *       201:
 *         description: Photo added successfully
 */
// Define a route for uploading a new photo
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        // 1. 插入新的照片資料
        let newPhoto = { tags: '', description: '' };
        if (req.body.class_type) {
            newPhoto.class_type = req.body.class_type;
        }
        if (req.body.tags) {
            newPhoto.tags = req.body.tags;
        }
        if (req.body.description) {
            newPhoto.description = req.body.description;
        }
        newPhoto.upload_datetime = new Date();
        newPhoto._id = (0, uuid_1.v4)();
        newPhoto.file_urt = req.file.path; // Save the file path to the photo model
        try {
            newPhoto = yield service_photo.add_Photo(newPhoto);
            console.log('新增照片:', newPhoto);
            //res.send(`File uploaded: ${req.file.filename}`);
            res.json(newPhoto);
        }
        catch (error) {
            console.error('新增照片失敗:', error);
        }
    }));
}));
exports.default = router;
