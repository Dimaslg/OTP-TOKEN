module.exports = () => {

    let users = [];


    module.getUser = (username) => {
        return users.find(user => user.username === username);
    }

    module.createUser = (user) => {
        users.push(user);
    }

    //Devuelve -1 si no existe y 0 cuando existe el usuario
    module.checkUser = (username) => {
        check = users.findIndex(user => {
            if (user.username === username) {
                return true;
            }
        })
        return check;
    }


    return module;

}