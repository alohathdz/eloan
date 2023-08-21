import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

function CreateLoan() {

    const { id } = useParams();
    const [name, setName] = useState('');

    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getMember();
    }, [])

    const getMember = async () => {
        await axios.get(`http://localhost:8081/member/edit/${id}`)
            .then(res => {
                setName(res.data[0].name)
            }).catch(err => console.log(err))
    }

    const handleCreate = async (e) => {
        e.preventDefault();

        await axios.post(`http://localhost:8081/member/loan/create`, { amount, rate, id })
            .then(res => {
                console.log(res);
                Swal.fire({
                    icon: "success",
                    text: "Create Loan Successfully."
                })

                navigate(`/member/detail/${id}`);
            }).catch(err => console.log(err))
    }

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
                                                <Form.Control type="text" onChange={e => setAmount(e.target.value)} />
                                            </Form.Group>
                                            <Form.Group controlId="Rate" className='mb-3'>
                                                <Form.Label>อัตราดอกเบี้ย</Form.Label>
                                                <Form.Control type="text" onChange={e => setRate(e.target.value)} />
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