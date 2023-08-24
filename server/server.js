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
    database: "loan"
});

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

app.get('/member', (req, res) => {
    const sql = "SELECT m.member_id, name, (SELECT SUM(balance) FROM loan WHERE member_id = m.member_id) AS balance, (SELECT SUM(balance)*(rate/100) FROM loan WHERE member_id = m.member_id) AS interest FROM member m";

    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.post('/member/create', (req, res) => {
    const sql = "INSERT INTO member (name) VALUES(?)";
    const values = req.body.name;

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.get('/member/edit/:id', (req, res) => {
    const sql = "SELECT * FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.put('/member/update/:id', (req, res) => {
    const sql = "UPDATE member SET name = ? WHERE member_id = ?";
    const id = req.params.id;
    const values = req.body.name;

    db.query(sql, [values, id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.delete('/member/delete/:id', (req, res) => {
    const sql = "DELETE FROM member WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.get('/loan/:id', (req, res) => {
    const sql = "SELECT loan_id, amount, balance, rate, start_date, pay_date, (SELECT SUM(loan) FROM payment WHERE loan_id = l.loan_id) AS loan, (SELECT SUM(interest) FROM payment WHERE loan_id = l.loan_id) AS interest FROM loan l WHERE member_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.post('/loan/create', (req, res) => {
    const sql = "INSERT INTO loan (amount, rate, balance, start_date, pay_date, member_id) VALUES(?)";

    var balance = req.body.amount;

    var date_time = new Date(req.body.start_date);
    var date = date_time.getDate();
    var month = date_time.getMonth() + 1;
    var year = date_time.getFullYear();
    var start_date = year + "-" + month + "-" + date;

    const monthNextEven = [3, 5, 10];
    const monthNextOdd = [7, 12];
    const monthSpecial = [1, 2];
    if (daysInMonth(month, year) == 30) {
        var days = 30;
    } else if (monthNextEven.includes(month)) {
        var days = 30;
    } else if (monthNextOdd.includes(month)) {
        var days = 31;
    } else if (monthSpecial.includes(month)) {
        var days = 28;
    }
    
    var paydate_time = new Date(date_time.setDate(date_time.getDate() + days));
    var paydate = paydate_time.getDate();
    var paymonth = paydate_time.getMonth() + 1;
    var payyear = paydate_time.getFullYear();
    var pay_date = payyear + "-" + paymonth + "-" + paydate;

    const values = [
        req.body.amount,
        req.body.rate,
        balance,
        start_date,
        pay_date,
        req.body.id,
    ];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.delete('/loan/delete/:id', (req, res) => {
    const sql = "DELETE FROM loan WHERE loan_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.get('/loan/edit/:id', (req, res) => {
    const sql = "SELECT amount, rate, start_date, name FROM loan d INNER JOIN member m ON d.member_id = m.member_id WHERE loan_id = ?";
    const id = req.params.id;

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

app.put('/loan/update/:id', (req, res) => {
    const sql = "UPDATE loan SET amount = ?, rate = ?, start_date = ? WHERE loan_id = ?";
    const id = req.params.id;

    db.query(sql, [req.body.amount, req.body.rate, req.body.start_date, id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
});

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
        db.query("UPDATE loan SET balance = balance - ? WHERE loan_id = ?", [req.body.loan, req.body.id], (err, result) => {
            if (err) return res.json(err);
        });
        if (err) return res.json(err);
        return res.json(result);
    });
});

app.get('/', (req, res) => {
    let date = new Date();
    let month = date.getMonth() + +2;
    let year = date.getFullYear();
    const month_odd = [1, 3, 5, 7, 8, 10, 12];

    if (month_odd.includes(month)) {
        var days = 'odd';
    } else {
        var days = 'even';
    }
    return res.json(days);
});