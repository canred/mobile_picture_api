"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
// 創建 NeDB 實例，指定檔案名稱，並自動載入
const db = new nedb_1.default({ filename: 'database.db', autoload: true });
exports.default = db;
