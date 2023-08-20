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

app.get('/', (req, res) => {
    let ts = Date.now();

    let date_time = new Date(ts);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    
    console.log(year + "-" + month + "-" + date);
    return res.json(year + "-" + month + "-" + date);
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

app.delete('/member/delete/:id', (req, res) => {
    const sql = "DELETE FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json("Error delete!");
        return res.json(result);
    })
})

app.get('/member/detail/:id', (req, res) => {
    const sql = "SELECT detail_id, amount, rate, start_date FROM detail WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json("Error select!");
        return res.json(result);
    })
})

app.post('/member/loan/create', (req, res) => {
    const sql = "INSERT INTO detail (amount, rate, start_date, member_id) VALUES(?)";

    let ts = Date.now();
    let date_time = new Date(ts);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let start_date = year + "-" + month + "-" + date;

    const values = [
        req.body.amount,
        req.body.rate,
        start_date,
        req.body.id,
    ];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.delete('/loan/delete/:id', (req, res) => {
    const sql = "DELETE FROM detail WHERE detail_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json("Error delete!");
        return res.json(result);
    })
})

app.get('/loan/edit/:id', (req, res) => {
    const sql = "SELECT amount, rate, name FROM `detail` d INNER JOIN member m ON d.member_id = m.member_id WHERE detail_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json("Error edit!");
        return res.json(result);
    })
})

app.put('/loan/update/:id', (req, res) => {
    const sql = "UPDATE detail SET amount = ?, rate = ? WHERE detail_id = ?";
    const id = req.params.id;

    db.query(sql, [req.body.amount, req.body.rate, id], (err, result) => {
        if (err) return res.json("Eror update!");
        return res.json(result);
    })
})