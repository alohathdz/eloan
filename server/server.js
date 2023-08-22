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

    let date_time = new Date(Date.now());
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let start_date = year + "-" + month + "-" + date;

    let paydate_time = new Date(date_time.setDate(date_time.getDate() + 31));
    let paydate = paydate_time.getDate();
    let paymonth = paydate_time.getMonth() + 1;
    let payyear = paydate_time.getFullYear();
    let pay_date = payyear + "-" + paymonth + "-" + paydate;

    return res.json(start_date + ' กับ ' + pay_date);
})

app.get('/member', (req, res) => {
    const sql = "SELECT * FROM member";

    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.post('/member/create', (req, res) => {
    const sql = "INSERT INTO member (name) VALUES(?)";
    const values = req.body.name;

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.get('/member/edit/:id', (req, res) => {
    const sql = "SELECT * FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.put('/member/update/:id', (req, res) => {
    const sql = "UPDATE member SET name = ? WHERE member_id = ?";
    const id = req.params.id;
    const values = req.body.name;

    db.query(sql, [values, id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.delete('/member/delete/:id', (req, res) => {
    const sql = "DELETE FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.get('/member/loan/:id', (req, res) => {
    const sql = "SELECT loan_id, amount, rate, start_date, pay_date, (SELECT SUM(loan) FROM payment WHERE loan_id = l.loan_id) AS loan, (SELECT SUM(interest) FROM payment WHERE loan_id = l.loan_id) AS interest FROM loan l WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.post('/member/loan/create', (req, res) => {
    const sql = "INSERT INTO loan (amount, rate, start_date, pay_date, member_id) VALUES(?)";

    let date_time = new Date(req.body.start_date);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let start_date = year + "-" + month + "-" + date;

    let paydate_time = new Date(date_time.setDate(date_time.getDate() + 30));
    let paydate = paydate_time.getDate();
    let paymonth = paydate_time.getMonth() + 1;
    let payyear = paydate_time.getFullYear();
    let pay_date = payyear + "-" + paymonth + "-" + paydate;

    const values = [
        req.body.amount,
        req.body.rate,
        start_date,
        pay_date,
        req.body.id,
    ];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.delete('/loan/delete/:id', (req, res) => {
    const sql = "DELETE FROM loan WHERE loan_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.get('/loan/edit/:id', (req, res) => {
    const sql = "SELECT amount, rate, start_date, name FROM loan d INNER JOIN member m ON d.member_id = m.member_id WHERE loan_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.put('/loan/update/:id', (req, res) => {
    const sql = "UPDATE loan SET amount = ?, rate = ?, start_date = ? WHERE loan_id = ?";
    const id = req.params.id;

    db.query(sql, [req.body.amount, req.body.rate, req.body.start_date, id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.post('/payloan/create', (req, res) => {
    const sql = "INSERT INTO payment (loan, interest, pay_date, loan_id) VALUES(?)";
    let date_time = new Date(req.body.pay_date);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let pay_date = year + "-" + month + "-" + date;
    const values = [
        req.body.loan,
        req.body.interest,
        pay_date,
        req.body.id
    ]

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.get('/DetailLoan/pay/:id', (req, res) => {
    const sql = "SELECT SUM(loan) AS loan, SUM(interest) AS interest FROM payment p INNER JOIN loan l ON p.loan_id = l.loan_id WHERE p.loan_id = ?";

    db.query(sql, req.params.id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})