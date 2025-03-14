import Datastore from 'nedb';

// 創建 NeDB 實例，指定檔案名稱，並自動載入
const db = new Datastore({ filename: 'dbStorage/database.db', autoload: true });

export default db;