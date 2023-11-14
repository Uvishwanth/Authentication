
import mysql from 'mysql2';

import dotenv from 'dotenv';

import express from 'express';

import bcrypt from 'bcrypt';


// configuring .env to node.js

dotenv.config();

//setting express environment

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connecting database
const connection = mysql.createConnection(
    {
        host: process.env.db_host,
        user: process.env.db_user,
        password: process.env.db_password,
        database: process.env.db_database,
    }
)

// ensuring database connection
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});


//sending index.html to sever

app.get('/login', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
})

//sending homepage.html to sever

app.get('/homepage', (req, res) => {
    res.sendFile(process.cwd() + '/homepage.html');
})

//creating route for log-in.
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('select * from user where email= ?  AND password= ?', [email, password], (error, results) => {
        if (error) {
            res.status(500).json({ success: false, message: 'i Found some error in server ', error })
        }
        else {
            if (results.length > 0) {
                const hashPassword = results[0].password;
                bcrypt.compare(password, hashPassword, (err, passwordMatch) => {
                    if (passwordMatch) {
                        res.json({ success: true, message: 'logged in true' })
                    }
                    else {
                        res.status(401).json({ success: false, message: 'invalid user or login' })
                    }
                })

            }
            else {
                res.status(401).json({ success: false })
            }
        }
    })
})

//sending registration.html to sever
app.get('/registration', (req, res) => {
    res.sendFile(process.cwd() + '/registration.html');
})

//creating route registration.
app.post('/registration', (req, res) => {
    const { firstname, lastname, email, password, confirm } = req.body

    bcrypt.hash(password, 10, (err, hashPassword) => {

        if (err) {
            res.status(500).json({ success: false })
        }
        else {
            connection.query('insert into user(firstname, lastname, email, Password, confirm) VALUES(?, ?, ?, ?, ?)', [firstname, lastname, email, password, confirm], (error, results) => {
                if (error) {
                    res.json({ success: false, message: 'Failed To Register!' })
                }
                else {
                    res.json({ success: true });
                }
            })
        }
    })
});

//listening to server
app.listen(3000, () => {
    console.log('http://localhost:3000/login \n', 'http://localhost:3000/registration')
})
