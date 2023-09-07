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
    database: "eloan",
    multipleStatements: true
});

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

app.get('/member', (req, res) => {
    const sql = "SELECT m.member_id, name, SUM(balance) AS balance, SUM(balance*rate/100) AS interest FROM member m LEFT JOIN loan l ON l.member_id = m.member_id GROUP BY name ORDER BY m.member_id ASC"
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.post('/member/create', (req, res) => {
    db.query("INSERT INTO member (name) VALUES(?)", req.body.name, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.get('/member/edit/:id', (req, res) => {
    db.query("SELECT * FROM member WHERE member_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.put('/member/update/:id', (req, res) => {
    db.query("UPDATE member SET name = ? WHERE member_id = ?", [req.body.name, req.params.id], (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.delete('/member/delete/:id', (req, res) => {
    db.query("DELETE FROM member WHERE member_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.get('/loan/:id', (req, res) => {
    db.query("SELECT l.loan_id, name, amount, balance, rate, start_date, due_date, SUM(loan) AS loan, SUM(interest) AS interest FROM loan l LEFT JOIN member m ON l.member_id = m.member_id LEFT JOIN payment p ON p.loan_id = l.loan_id WHERE l.member_id = ? GROUP BY l.loan_id", req.params.id, (err, result) => {
        if (err) throw err;
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
        if (err) throw err;
        return res.json(result);
    })
});

app.delete('/loan/delete/:id', (req, res) => {
    db.query("DELETE FROM loan WHERE loan_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.get('/loan/edit/:id', (req, res) => {
    db.query("SELECT amount, rate, start_date, name FROM loan d INNER JOIN member m ON d.member_id = m.member_id WHERE loan_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.put('/loan/update/:id', (req, res) => {
    db.query("UPDATE loan SET amount = ?, rate = ?, start_date = ? WHERE loan_id = ?", [req.body.amount, req.body.rate, req.body.start_date, req.params.id], (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.post('/pay/create', (req, res) => {
    const sql1 = "INSERT INTO payment (loan, interest, pay_date, loan_id) VALUES(?);"
    const sql2 = "UPDATE loan SET balance = balance - ?, due_date = DATE_ADD(due_date, INTERVAL 1 MONTH) WHERE loan_id = ?"
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

    db.query(sql1 + sql2, [values, req.body.loan, req.body.id], (err, result) => {
        if (err) throw err
        return res.json(result)
    })
});

app.get('/pay/edit/:id', (req, res) => {
    db.query("SELECT * FROM payment WHERE payment_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    });
})

app.put('/pay/update/:id', (req, res) => {
    const sql1 = "UPDATE loan SET balance = balance + ?, due_date = DATE_ADD(due_date, INTERVAL -1 MONTH) WHERE loan_id = ?;"
    const sql2 = "UPDATE payment SET loan = ?, interest = ?, pay_date = ? WHERE payment_id = ?;"
    const sql3 = "UPDATE loan SET balance = balance - ?, due_date = DATE_ADD(due_date, INTERVAL 1 MONTH) WHERE loan_id = ?"
    let date_time = new Date(req.body.pay_date);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let pay_date = year + "-" + month + "-" + date;

    db.query(sql1 + sql2 + sql3, [req.body.old_loan, req.body.loan_id, req.body.loan, req.body.interest, pay_date, req.params.id, req.body.loan, req.body.loan_id], (err, result) => {
        if (err) throw err
        return res.json(result)
    })
});

app.delete('/pay/delete/:id', (req, res) => {
    const sql1 = "SELECT loan, loan_id FROM payment WHERE payment_id = ?"
    const sql2 = "UPDATE loan SET balance = balance + ?, due_date = DATE_ADD(due_date, INTERVAL -1 MONTH) WHERE loan_id = ?;"
    const sql3 = "DELETE FROM payment WHERE payment_id = ?"
    db.query(sql1, req.params.id, (err, result) => {
        if (err) throw err

        const loan = result[0].loan
        const loan_id = result[0].loan_id

        db.query(sql2 + sql3, [loan, loan_id, req.params.id], (err, result) => {
            if (err) throw err
            return res.json(result)
        })
    })
})

app.get('/CheckDueDate', (req, res) => {
    db.query("SELECT DISTINCT(member_id) FROM `loan` WHERE due_date > NOW()", (err, result) => {
        if (err) throw err;
        return res.json(result);
    });
});

app.post('/pay/interest/:id', (req, res) => {
    const sql1 = "SELECT loan_id, balance*rate/100 AS interest FROM loan WHERE member_id = ?"
    const sql2 = "INSERT INTO payment (loan, interest, pay_date, loan_id) VALUES(0, ?, ?, ?);"
    const sql3 = "UPDATE loan SET due_date = DATE_ADD(due_date, INTERVAL 1 MONTH) WHERE loan_id = ?"
    let date_time = new Date(req.body.pay_date);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let pay_date = year + "-" + month + "-" + date;

    db.query(sql1, req.params.id, (err, result) => {
        if (err) throw err
        for (let i = 0; i < result.length; i++) {
            let loan_id = result[i].loan_id;
            let interest = result[i].interest;
            db.query(sql2 + sql3, [interest, pay_date, loan_id, loan_id], (err, result) => {
                if (err) throw err
            })
        }
        return res.json(result)
    });
});

app.get('/PayList/:id', (req, res) => {
    db.query("SELECT payment_id, loan, interest, pay_date FROM payment WHERE loan_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.get('/LoanList/:id', (req, res) => {
    db.query("SELECT balance, balance*rate/100 AS interest, name FROM loan l INNER JOIN member m ON l.member_id = m.member_id WHERE loan_id = ?", req.params.id, (err, result) => {
        if (err) throw err;
        return res.json(result);
    })
});

app.get('/', (req, res) => {
    const sql1 = "SELECT loan, loan_id FROM payment WHERE payment_id = ?"
});