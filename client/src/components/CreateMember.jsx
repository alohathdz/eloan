import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

function CreateMember() {

    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();

        await axios.post('http://localhost:8081/member/create', { name })
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Insert successfully."
                })

                navigate("/member");
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">เพิ่มข้อมูลผู้กู้</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={handleCreate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Name" className='mb-3'>
                                                <Form.Label>ชื่อ</Form.Label>
                                                <Form.Control type="text" onChange={e => setName(e.target.value)} required/>
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

export default CreateMember