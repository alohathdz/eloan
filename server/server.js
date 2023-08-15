import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8081, () => {
    console.log("Server start!");
})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "loan"
})

app.get('/member', (req, res) => {
    const sql = "SELECT * FROM member";

    db.query(sql, (err, result) => {
        if (err) return res.json("Error select!");
        return res.json(result);
    })
})

app.post('/member/create', (req, res) => {
    const sql = "INSERT INTO member (name) VALUES(?)";
    const values = req.body.name;

    db.query(sql, [values], (err, result) => {
        if (err) return res.json("Error insert!");
        return res.json(result);
    })
})

app.get('/member/edit/:id', (req, res) => {
    const sql = "SELECT * FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json("Error edit!");
        return res.json(result);
    })
})

app.put('/member/update/:id', (req, res) => {
    const sql = "UPDATE member SET name = ? WHERE member_id = ?";
    const id = req.params.id;
    const values = req.body.name;

    db.query(sql, [values, id], (err, result) => {
        if (err) return res.json("Eror update!");
        return res.json(result);
    })
})

app.delete('/member/:id', (req, res) => {
    const sql = "DELETE FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json("Error delete!");
        return res.json(result);
    })
})