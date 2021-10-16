const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;
const passwordValidator = require('password-validator');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});


app.post('/register', async (req, res) => {
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {

            let schema = new passwordValidator();

            schema
                .is().min(8)
                .has().uppercase()
                .has().lowercase()
                .has().not().spaces()

            if (schema.validate(req.body.password) == false) {
                res.send("<div align ='center'><h2>Password harus min 8 karakter, memiliki kapital dan kecil, dan tidak spasi</h2></div><br><br><div align='center'><a href='/'>Register again</a></div>");
            } else {
                let hashPassword = await bcrypt.hash(req.body.password, 10);

                let newUser = {
                    id: Date.now(),
                    username: req.body.username,
                    email: req.body.email,
                    password: hashPassword,
                };
                users.push(newUser);
                console.log('User list', users);

                res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='/'>Register another user</a></div>");
            }


        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='/'>Register again</a></div>");
        }
    } catch {
        res.send("Internal server error");
    }
});


server.listen(3000, function () {
    console.log("server is listening on port: 3000");
});