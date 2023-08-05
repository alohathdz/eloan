import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

function CreateMember() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [validate, setValidate] = useState({});

    const createMember = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', name);

        await axios.post(`http://localhost:8081/member/create`, formData).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate("/member");
        }).catch(({ response }) => {
            if (response.status === 422) {
                setValidate(response.data.errors);
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: "error"
                })
            }
        })
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
                                {Object.keys(validate).length > 0 && (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="alert alert-danger">
                                                <ul className="mb-0">
                                                    {Object.entries(validate).map(([key, value]) => (
                                                        <li key={key}>{value}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <Form onSubmit={createMember}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Name">
                                                <Form.Label>ชื่อ</Form.Label>
                                                <Form.Control type="text" value={name} onChange={(event) => {
                                                    setName(event.target.value)
                                                }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" className="mt-2" size="sm" block="block" type="submit">บันทึก</Button>
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