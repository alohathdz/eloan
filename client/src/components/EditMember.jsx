import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

function EditMember() {

    const { id } = useParams();
    const [name, setName] = useState('');
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

    const handleUpdate = async (e) => {
        e.preventDefault();

        await axios.put(`http://localhost:8081/member/update/${id}`, {name})
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Update successfully!"
                })
                navigate("/member")
            }).catch(err => console.log(err))
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
                                <Form onSubmit={handleUpdate}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Name">
                                                <Form.Label>ชื่อ</Form.Label>
                                                <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
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

export default EditMember