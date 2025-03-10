import express, { Response, Request, NextFunction } from 'express';
import multer from 'multer';
import * as service_photo from '../Services/Photo_Service';
import { Photo_Model } from '../Models/Photo_Model';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { callbackify } from 'util';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

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
router.get('/get', async (req: Request, res: Response) => {
  // Logic to get all photos
  let all_photo: Photo_Model[] = await service_photo.get_Photos();
  res.json(all_photo);
});

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
router.get('/getClassType', async (req: Request, res: Response) => {
  try {
    let all_photo: Photo_Model[] = await service_photo.get_Photos();
    let classTypes = [...new Set(all_photo.map(photo => photo.class_type).filter(classType => classType !== null && classType !== undefined))];
    res.json(classTypes);
  } catch (error) {
    res.status(500).send('Error retrieving class types');
  }
});

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
router.get('/search/:keyword', async (req: Request, res: Response) => {
  const keyword = req.params.keyword.toLowerCase();
  try {
    let all_photo: Photo_Model[] = await service_photo.get_Photos();
    if(keyword === 'all'){
      res.json(all_photo);
      return;
    }else{
      let filtered_photos = all_photo.filter((photo:Photo_Model) => 
        photo.tags!.toLowerCase().includes(keyword) || 
        photo.description!.toLowerCase().includes(keyword)
      );
      res.json(filtered_photos);
    }
  } catch (error) {
    res.status(500).send('Error searching photos');
  }
});

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
router.get('/search/:calssType/:keyword', async (req: Request, res: Response) => {
  const keyword = req.params.keyword.toLowerCase();
  try {
    let all_photo: Photo_Model[] = await service_photo.get_Photos();
    if(keyword === 'all'){
      let filtered_photos = all_photo.filter((photo:Photo_Model) => 
        photo.class_type === req.params.calssType 
      );
      filtered_photos.sort((a,b) => {
        return b.upload_datetime!.getTime() - a.upload_datetime!.getTime();});
      res.json(filtered_photos);
      return;
    }else{
      let filtered_photos = all_photo.filter((photo:Photo_Model) => 
        photo.class_type === req.params.calssType &&
        photo.tags!.toLowerCase().includes(keyword) || 
        photo.description!.toLowerCase().includes(keyword)
      );
      filtered_photos.sort((a,b) => {
        return b.upload_datetime!.getTime() - a.upload_datetime!.getTime();});
      res.json(filtered_photos);
    }
    
  } catch (error) {
    res.status(500).send('Error searching photos');
  }
});
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
router.post('/add', async (req: Request, res: Response) => {
  upload.single('photo')(req, res, async (err: any) => {
   
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // 1. 插入新的照片資料
    let newPhoto: Photo_Model = { tags: '', description: '' };
    if(req.body.class_type){
      newPhoto.class_type = req.body.class_type;
    }
    if (req.body.tags) {
      newPhoto.tags = req.body.tags;
    }
    if (req.body.description) {
      newPhoto.description = req.body.description;
    }
    newPhoto.upload_datetime = new Date();
    newPhoto._id = uuidv4();
    newPhoto.file_urt = req.file.path; // Save the file path to the photo model
    try {
      newPhoto = await service_photo.add_Photo(newPhoto);
      console.log('新增照片:', newPhoto);
      //res.send(`File uploaded: ${req.file.filename}`);
      res.json(newPhoto);
    } catch (error) {
      console.error('新增照片失敗:', error);
    }
  });
});

export default router;