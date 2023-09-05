import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/min/moment-with-locales'

function EditPay() {

    const { id } = useParams();
    const navigate = useNavigate();
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
                setValues({ ...values, loan: res.data[0].loan, interest: res.data[0].interest, pay_date: res.data[0].pay_date, loan_id: res.data[0].loan_id, old_loan: res.data[0].loan })
            }).catch(err => console.log(err))
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        await axios.put('http://localhost:8081/pay/update/' + id, values)
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Update Payment Success!"
                })
                navigate(-1)
            }).catch(err => console.log(err))
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">แก้ไขการชำระเงินกู้</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={handleUpdate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Loan" className='mb-3'>
                                                <Form.Label>ชำระเงินต้น</Form.Label>
                                                <Form.Control type="number" value={values.loan} onChange={e => setValues({ ...values, loan: e.target.value })} required/>
                                            </Form.Group>
                                            <Form.Group controlId="Interest" className='mb-3'>
                                                <Form.Label>ชำระดอกเบี้ย</Form.Label>
                                                <Form.Control type="number" value={values.interest} onChange={e => setValues({ ...values, interest: e.target.value })} required/>
                                            </Form.Group>
                                            <Form.Group controlId="PayDate" className='mb-3'>
                                                <Form.Label>วันที่ชำระ</Form.Label>
                                                <Form.Control type="date" value={moment(values.pay_date).format('YYYY-MM-DD')} onChange={e => setValues({ ...values, pay_date: e.target.value })} required/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button className="btn btn-sm btn-primary me-2" type="submit">บันทึก</Button>
                                    <Button className="btn btn-sm btn-danger" onClick={() => navigate(-1)}>ยกเลิก</Button>
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