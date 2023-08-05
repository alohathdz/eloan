import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "loan"
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM member";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error query mysql."});
        return res.json(result);
    })
})

app.get('/member', (req, res) => {
    db.query("SELECT * from member", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/member/create', (req, res) => {
    const name = req.body.name;

    db.query("INSERT INTO member (`name`) VALUES(?)", [name], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Insert success.");
        }
    })
})

app.listen(8081, () => {
    console.log("Server start!");
})