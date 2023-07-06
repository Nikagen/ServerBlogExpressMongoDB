import jwt from 'jsonwebtoken'; //1. 

//middleware (функция-посредник)
export default (req, res, next) => { //2. здесь нам необходимо спарсить токен и расшифровать его
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); //в переменную token из запроса вытащить из headers authorization

    // console.log(token)//проверка, есть ли токен из запроса
    // //затем переходим в index.js и импортируем эту функцию

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123') //расшифровка кода с помощью jwt
            //если смогли расшифровать токен то:
            req.userId = decoded._id //вшиваем id в реквест
            next(); //после выполнения этого условия переходим в index в auth/me
        } 
        // если токен не удалось расшифровать, то:
        catch (error) {
            return res.status(403).json({
                message: 'Нет доступа'
            });
        }
    }
    else {
        return res.status(403).json({
            message: 'Нет доступа'
        });
    }

    // res.send(token);

    // next() //после того, как мы сделали бесконечно выполняющийся запрос, передаем функцию next 

    //далее необходимо спарсить токен, для этого переходим в insomnia и с помощью вкладки auth, выбираем bearer, и в строку token передаем из login токен
    //после этого заменяем console.log на res.send(token)
    //чтобы передать сам токен без значения bearer, необходимо в const token передать строчку с регулярным выражнием (которое удаляет слово bearer и заменяет на строку)
    //после этого создаем условие и try catch
}