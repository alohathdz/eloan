import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8081, () => {
    console.log("Server start!");
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "eloan"
});

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

app.get('/member', (req, res) => {
    const sql = "SELECT m.member_id, name, SUM(amount) AS amount, SUM(balance) AS balance, SUM(balance*rate/100) AS interest, SUM(loan) AS pay_loan, SUM(interest) AS pay_interest FROM payment p RIGHT JOIN loan l ON p.loan_id = l.loan_id RIGHT JOIN member m ON l.member_id = m.member_id GROUP BY name";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.post('/member/create', (req, res) => {
    db.query("INSERT INTO member (name) VALUES(?)", req.body.name, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.get('/member/edit/:id', (req, res) => {
    db.query("SELECT * FROM member WHERE member_id = ?", req.params.id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.put('/member/update/:id', (req, res) => {
    db.query("UPDATE member SET name = ? WHERE member_id = ?", [req.body.name, req.params.id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.delete('/member/delete/:id', (req, res) => {
    db.query("DELETE FROM member WHERE member_id = ?", req.params.id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.get('/loan/:id', (req, res) => {
    const sql = "SELECT l.loan_id, name, amount, balance, rate, start_date, due_date, SUM(loan) AS loan, SUM(interest) AS interest FROM loan l LEFT JOIN member m ON l.member_id = m.member_id LEFT JOIN payment p ON p.loan_id = l.loan_id WHERE l.member_id = ? GROUP BY l.loan_id";
    db.query(sql, req.params.id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.post('/loan/create', (req, res) => {
    let balance = req.body.amount;

    let date_time = new Date(req.body.start_date);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let start_date = year + "-" + month + "-" + date;

    const values = [
        req.body.amount,
        req.body.rate,
        balance,
        start_date,
        req.body.id
    ];

    db.query("INSERT INTO loan (amount, rate, balance, start_date, member_id, due_date) VALUES(?, DATE_ADD(?, INTERVAL 1 MONTH))", [values, start_date], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.delete('/loan/delete/:id', (req, res) => {
    db.query("DELETE FROM loan WHERE loan_id = ?", req.params.id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.get('/loan/edit/:id', (req, res) => {
    db.query("SELECT amount, rate, start_date, name FROM loan d INNER JOIN member m ON d.member_id = m.member_id WHERE loan_id = ?", req.params.id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.put('/loan/update/:id', (req, res) => {
    db.query("UPDATE loan SET amount = ?, rate = ?, start_date = ? WHERE loan_id = ?", [req.body.amount, req.body.rate, req.body.start_date, req.params.id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.post('/pay/create', (req, res) => {
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

    db.query("INSERT INTO payment (loan, interest, pay_date, loan_id) VALUES(?)", [values], (err, result) => {
        db.query("UPDATE loan SET balance = balance - ?, due_date = DATE_ADD(due_date, INTERVAL 1 MONTH) WHERE loan_id = ?", [req.body.loan, req.body.id]);
        if (err) return res.json(err);
        return res.json(result);
    });
});

app.get('/CheckDueDate', (req, res) => {
    db.query("SELECT DISTINCT(member_id) FROM `loan` WHERE due_date > NOW()", (err, result) => {
        if (err) console.log(err);
        return res.json(result);
    });
});

app.get('/', (req, res) => {
});