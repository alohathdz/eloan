import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

function CreateLoan() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const getName = async () => {
        await axios.get('http://localhost:8081/member/edit/' + id)
            .then(res => {
                setName(res.data[0].name);
            }).catch(err => console.log(err))
    }

    const [values, setValues] = useState({
        amount: '',
        rate: '',
        start_date: '',
        id: id
    });

    const [errors, setErrors] = useState({})

    const handleChange = async (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }

    const handleCreate = async (e) => {
        e.preventDefault();

        const validationError = {}
        if (!values.amount.trim()) { validationError.amount = "กรุณาใส่ยอดที่กู้" }
        if (!values.rate.trim()) { validationError.rate = "กรุณาใส่อัตราดอกเบี้ย" }
        if (!values.start_date.trim()) { validationError.start_date = "กรุณาเลือกวันที่กู้" }

        setErrors(validationError)

        if (Object.keys(validationError).length === 0) {
            await axios.post('http://localhost:8081/loan/create', values)
                .then(res => {
                    Swal.fire({
                        icon: "success",
                        text: "Create Loan Successfully."
                    });
                    navigate(-1);
                }).catch(err => console.log(err))
        }
    }

    useEffect(() => {
        getName();
    }, [])

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">เพิ่มข้อมูลการกู้ของ {name}</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={handleCreate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Amount" className='mb-3'>
                                                <Form.Label>ยอดกู้</Form.Label>
                                                <Form.Control type="number" name="amount" onChange={handleChange} />
                                                {errors.amount && <p style={{color: 'red'}}>{errors.amount}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="Rate" className='mb-3'>
                                                <Form.Label>อัตราดอกเบี้ย</Form.Label>
                                                <Form.Control type="number" name="rate" onChange={handleChange} />
                                                {errors.rate && <p style={{color: 'red'}}>{errors.rate}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="startDate" className='mb-3'>
                                                <Form.Label>วันที่กู้</Form.Label>
                                                <Form.Control type="date" name="start_date" onChange={handleChange} />
                                                {errors.start_date && <p style={{color: 'red'}}>{errors.start_date}</p>}
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

export default CreateLoan