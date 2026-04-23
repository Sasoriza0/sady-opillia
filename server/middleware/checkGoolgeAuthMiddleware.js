const checkAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/google');  // Якщо не авторизований, перенаправляємо на вхід через Google
    }
    next();  // Якщо авторизований, продовжуємо виконання
};

module.exports ={
    checkAuth
}