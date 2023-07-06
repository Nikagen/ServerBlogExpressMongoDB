import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { loginValidation, postCreateValidation, registerValidation } from './validations.js'

import { checkAuth, handleValidationErrors } from './utils/index.js'

import { UserController, PostController, CommentController } from './controllers/index.js';

//подключение mongoose
mongoose
    .connect('') 
    .then(() => console.log('DB ok'))                                                              
    .catch((error) => console.log('DB error', error))                                              

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, callback) => {                                                            
        callback(null, 'uploads')      
        
    },
    filename: (_, file, callback) => {  
        callback(null, file.originalname); 
    }, 
});   

const upload = multer({ storage }) 



app.use(express.json());
app.use(cors()); 

app.use('/uploads', express.static('uploads'))


//авторизация запрос
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)   

//регистрация запрос
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register) 

//проверка на то, что авторизован или нет
app.get('/auth/me', checkAuth, UserController.getMe) //после создания авторизации и регистрации проверяем, можем ли мы получить информацию о себе

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

//Запросы статей
//после создания PostController и импортирования создаем новый роут
app.get('/tags', PostController.getLastTags); 

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags); //запрос на получение списка тэгов. Переходим в post controller и создаем метод getLastTags
app.post('/comments/:id', checkAuth, CommentController.create);
app.get('/comments', checkAuth, CommentController.getAll);

app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4000, (err) => {//проверка работы сервера
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})