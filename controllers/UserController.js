import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => { // 1.валидация: а) устанавливаем библиотеку express-validator б)импорт из авторизации в)передаем в post вторым параметром импортируемую функцию
    try { //4. оборачиваем код в try catch
        console.log(req.body)
    const password = req.body.password; 
    const salt = await bcrypt.genSalt(10); //2.д) создаем "соль"(алгоритм шифрования пароля) bcrypt. Объясняем, что функция post является async
    const hash = await bcrypt.hash(password, salt); //2. е) объясняем, что необходимо с bcrypt  зашифровать наш пароль (передаем пароль и алгоритм его шифрования). В этой переменной хранится защифрованный  пароль

    const doc = new UserModel({ //2. создание пользователя: а) импорт user, б) подготовление документа на создание пользователя
        email: req.body.email, // передача req.body
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash, // 2.в) для шифрования пароля установим bcrypt, г) выше doc необходимо объяснить, что необходимо вытащить из req.body пароль
    });                                
        
    const user = await doc.save(); // 3.а) создаем пользователя, сохраняем документ. Результат передаем в mongoDB

    const token = jwt.sign({ // после создания документа, шифровки пароля с помощью jwt создаем токен, указываем что наш токен  хранит зашифрованную информацию
        _id: user._id
    }, 
    'secret123', // ключ, благодаря которому шифруется токен
    {
        expiresIn: '30d' // сколько времени будет хранится токен (перестанет быть валидным через 30 дней)
    }
    )

    const { passwordHash, ...userData } = user._doc // 4.б) позволяет не возвращать passwordHash в запрос  в) снова делаем запрос (перед этим удаляем пользователя в мДБ компас)

    res.json({
        ...userData, // 4.Скрываем  пароль юзера из ответа. а) из мДБ компасс удаляем пользователя, перезагружаем и снова удаляем. В инсомниа повторно отправляем запрос. Это нужно для скрытия пароля от юзера из ответа
        token, 
    }); // 3.б) необходимо вернуть информацию о пользователе. Перед тем как сделать запрос, используем МБД компасс
    
    // res.json({ //возвращает, если нет ошибок в отправлении запросов
    //     success: true, 
    // });
    } catch (err) {
        console.log(err); // РОУТ НЕ ДОЛЖЕН ВЕРНУТЬ ДВА ОТВЕТА
        res.status(500).json({ // статус 500 - ответ в виде ошибки
            message: 'Не удалось зарегестрироваться',
        }); //5. возвращаем пользователю ответ
    }
};

export const login = async (req, res) => { // 5.а) Авторизация
    try {
        const user = await UserModel.findOne({ email: req.body.email })//а) проверяем, есть ли пользователь в БД. FindOne находит одного пользователя (в скобках указывается, по каким параметрам)
    
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден', //примечание: при разработке проекта необходимо максимально поверхностно объяснить, почему вывелась ошибка
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)//б) проверяем пароль пользователя (сходится ли с тем, что прислал пользователь). Первое значение - пароль в теле запроса, а второе - которое есть в документе у пользователя
    
        if(!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            })
        }

        const token = jwt.sign(  //генерируем токен 
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );

        const { passwordHash, ...userData } = user._doc; //вытаскиваем информацию о пользователе

        res.json({
            ...userData,
            token,
        }); 
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
};

export const getMe = async (req, res) => { 
    try { 
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }      
        const { passwordHash, ...userData } = user._doc;// объяснение в авторизации и регистрации
        res.json(userData); 
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Нет доступа',
        });
    }
};