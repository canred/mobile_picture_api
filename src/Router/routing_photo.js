"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var service_photo = require("../Services/Photo_Service");
var uuid_1 = require("uuid");
var path_1 = require("path");
var router = express_1.default.Router();
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = "".concat((0, uuid_1.v4)()).concat(path_1.default.extname(file.originalname));
        cb(null, uniqueSuffix);
    },
});
var upload = (0, multer_1.default)({ storage: storage });
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
router.get('/get', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all_photo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, service_photo.get_Photos()];
            case 1:
                all_photo = _a.sent();
                res.json(all_photo);
                return [2 /*return*/];
        }
    });
}); });
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
router.get('/getClassType', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all_photo, classTypes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, service_photo.get_Photos()];
            case 1:
                all_photo = _a.sent();
                classTypes = __spreadArray([], new Set(all_photo.map(function (photo) { return photo.class_type; }).filter(function (classType) { return classType !== null && classType !== undefined; })), true);
                res.json(classTypes);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).send('Error retrieving class types');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
router.get('/search/:keyword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, all_photo, filtered_photos, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keyword = req.params.keyword.toLowerCase();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, service_photo.get_Photos()];
            case 2:
                all_photo = _a.sent();
                if (keyword === 'all') {
                    res.json(all_photo);
                    return [2 /*return*/];
                }
                else {
                    filtered_photos = all_photo.filter(function (photo) {
                        return photo.tags.toLowerCase().includes(keyword) ||
                            photo.description.toLowerCase().includes(keyword);
                    });
                    res.json(filtered_photos);
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).send('Error searching photos');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
router.get('/search/:calssType/:keyword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, all_photo, filtered_photos, filtered_photos, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keyword = req.params.keyword.toLowerCase();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, service_photo.get_Photos()];
            case 2:
                all_photo = _a.sent();
                if (keyword === 'all') {
                    filtered_photos = all_photo.filter(function (photo) {
                        return photo.class_type === req.params.calssType;
                    });
                    filtered_photos.sort(function (a, b) {
                        return b.upload_datetime.getTime() - a.upload_datetime.getTime();
                    });
                    res.json(filtered_photos);
                    return [2 /*return*/];
                }
                else {
                    filtered_photos = all_photo.filter(function (photo) {
                        return photo.class_type === req.params.calssType &&
                            photo.tags.toLowerCase().includes(keyword) ||
                            photo.description.toLowerCase().includes(keyword);
                    });
                    filtered_photos.sort(function (a, b) {
                        return b.upload_datetime.getTime() - a.upload_datetime.getTime();
                    });
                    res.json(filtered_photos);
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).send('Error searching photos');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
router.post('/add', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        upload.single('photo')(req, res, function (err) { return __awaiter(void 0, void 0, void 0, function () {
            var newPhoto, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.file) {
                            return [2 /*return*/, res.status(400).send('No file uploaded.')];
                        }
                        newPhoto = { tags: '', description: '' };
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, service_photo.add_Photo(newPhoto)];
                    case 2:
                        newPhoto = _a.sent();
                        console.log('新增照片:', newPhoto);
                        //res.send(`File uploaded: ${req.file.filename}`);
                        res.json(newPhoto);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('新增照片失敗:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
exports.default = router;
