import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

function EditLoan() {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getLoans();
    }, [])

    const getLoans = async () => {
        await axios.get(`http://localhost:8081/loan/edit/${id}`)
        .then(res => {
            setValues({...values, amount: res.data[0].amount, rate: res.data[0].rate, name: res.data[0].name})
        }).catch(err => console.log(err))
    }
    
    const [values, setValues] = useState({
        amount: '',
        rate: '',
    });

    const handleUpdate = async (e) => {
        e.preventDefault();

        await axios.put(`http://localhost:8081/loan/update/${id}`, values)
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Update Loan Success!"
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
                            <h4 className="card-title">แก้ไขข้อมูลการกู้ของ {values.name}</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={handleUpdate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Amount" className='mb-3'>
                                                <Form.Label>ยอดกู้</Form.Label>
                                                <Form.Control type="text" value={values.amount} onChange={e => setValues({...values, amount: e.target.value})} />
                                            </Form.Group>
                                            <Form.Group controlId="Rate" className='mb-3'>
                                                <Form.Label>อัตราดอกเบี้ย</Form.Label>
                                                <Form.Control type="text" value={values.rate} onChange={e => setValues({...values, rate: e.target.value})} />
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

export default EditLoan