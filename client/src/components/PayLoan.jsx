import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

function PayLoan() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [values, setValues] = useState({
        loan: '',
        interest: '',
        pay_date: '',
        id: id
    });

    useEffect(() => {
        getName();
    }, [])

    const getName = async () => {
        await axios.get('http://localhost:8081/loan/edit/' + id)
            .then(res => {
                setName(res.data[0].name);
            }).catch(err => console.log(err))
    }

    const handleCreate = async (e) => {
        e.preventDefault();

        await axios.post('http://localhost:8081/payloan/create', values)
            .then(res => {
                console.log(res);
                Swal.fire({
                    icon: "success",
                    text: "การชำระยอด สำเร็จ!"
                })

                navigate(-1);
            }).catch(err => console.log(err))
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">ชำระเงินกู้ของ <font color="red">{name}</font></h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={handleCreate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Loan" className='mb-3'>
                                                <Form.Label>ชำระเงินต้น</Form.Label>
                                                <Form.Control type="text" onChange={e => setValues({ ...values, loan: e.target.value })} />
                                            </Form.Group>
                                            <Form.Group controlId="Interest" className='mb-3'>
                                                <Form.Label>ชำระดอกเบี้ย</Form.Label>
                                                <Form.Control type="text" onChange={e => setValues({ ...values, interest: e.target.value })} />
                                            </Form.Group>
                                            <Form.Group controlId="patDate" className='mb-3'>
                                                <Form.Label>วันที่ชำระ</Form.Label>
                                                <Form.Control type="date" onChange={e => setValues({ ...values, pay_date: e.target.value })} />
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

export default PayLoan