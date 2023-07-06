import { body } from 'express-validator' //с помощью функции будем проверять, есть ли в теле нашего запроса информация и ее валидировать

export const loginValidation = [ //прооверяет, есть ли емэйл пароль и другая информация
    body('email', 'Неверный формат почты').isEmail(), //проверка на наличие 
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
]

export const registerValidation = [ //прооверяет, есть ли емэйл пароль и другая информация
    body('email', 'Неверный формат почты').isEmail(), //проверка на наличие 
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('avatar', 'Неверная ссылка на аватарку').optional().isURL(),
]

export const postCreateValidation = [ //прооверяет, есть ли емэйл пароль и другая информация
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(), //проверка на наличие 
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]