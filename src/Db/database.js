"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nedb_1 = require("nedb");
// 創建 NeDB 實例，指定檔案名稱，並自動載入
var db = new nedb_1.default({ filename: 'database.db', autoload: true });
exports.default = db;
