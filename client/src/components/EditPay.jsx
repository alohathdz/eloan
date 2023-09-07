import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/min/moment-with-locales'

function EditPay() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [datas, setDatas] = useState({
        name: '',
        balance: '',
        interest: ''
    })
    const [values, setValues] = useState({
        loan: '',
        interest: '',
        pay_date: '',
        loan_id: '',
        old_loan: ''
    });

    useEffect(() => {
        getPayment();
    }, []);

    const getPayment = async () => {
        await axios.get('http://localhost:8081/pay/edit/' + id)
            .then(res => {
                setDatas({ ...datas, name: res.data[0].name, balance: res.data[0].balance, interest: res.data[0].itr })
                setValues({ ...values, loan: res.data[0].loan, interest: res.data[0].interest, pay_date: res.data[0].pay_date, loan_id: res.data[0].loan_id, old_loan: res.data[0].loan })
            }).catch(err => console.log(err))
    }

    const [errors, setErrors] = useState({})

    const handleChange = async (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const validationError = {}

        if (values.loan === "") validationError.loan = "กรุณาใส่ยอดชำระเงินต้น"
        if (values.interest === "") validationError.interest = "กรุณาใส่ยอดชำระดอกเบี้ย"
        if (values.pay_date === "") validationError.pay_date = "กรุณาเลือกวันที่ชำระ"

        setErrors(validationError)

        if (Object.keys(validationError).length === 0) {
            await axios.put('http://localhost:8081/pay/update/' + id, values)
                .then(res => {
                    Swal.fire({
                        icon: "success",
                        text: "Update Payment Success!"
                    })
                    navigate(-1)
                }).catch(err => console.log(err))
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">แก้ไขการชำระเงินกู้ <font style={{ color: 'red' }}>{datas.name}</font></h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={handleUpdate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Loan" className='mb-3'>
                                                <Form.Label>ชำระเงินต้น <font style={{ color: 'red' }}>( {datas.balance} )</font></Form.Label>
                                                <Form.Control type="number" name="loan" value={values.loan} onChange={handleChange} />
                                                {errors.loan && <p style={{ color: 'red' }}>{errors.loan}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="Interest" className='mb-3'>
                                                <Form.Label>ชำระดอกเบี้ย <font style={{ color: 'red' }}>( {datas.interest} )</font></Form.Label>
                                                <Form.Control type="number" name="interest" value={values.interest} onChange={handleChange} />
                                                {errors.interest && <p style={{ color: 'red' }}>{errors.interest}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="PayDate" className='mb-3'>
                                                <Form.Label>วันที่ชำระ</Form.Label>
                                                <Form.Control type="date" name="pay_date" value={moment(values.pay_date).format('YYYY-MM-DD')} onChange={handleChange} />
                                                {errors.pay_date && <p style={{ color: 'red' }}>{errors.pay_date}</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" size="sm" className="me-2" type="submit">บันทึก</Button>
                                    <Button variant="danger" size="sm" onClick={() => navigate(-1)}>ยกเลิก</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPay