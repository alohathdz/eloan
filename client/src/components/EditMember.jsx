import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

function EditMember() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: ''
    })

    useEffect(() => {
        getMember();
    }, [])

    const getMember = async () => {
        await axios.get('http://localhost:8081/member/edit/' + id)
            .then(res => {
                setValues({ ...values, name: res.data[0].name })
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
        if (values.name === "") validationError.name = "กรุณาใส่ชื่อ"

        setErrors(validationError)

        if (Object.keys(validationError).length === 0) {
            await axios.put('http://localhost:8081/member/update/' + id, values)
                .then(res => {
                    Swal.fire({
                        icon: "success",
                        text: "Update successfully!"
                    })
                    navigate("/member")
                }).catch(err => console.log(err))
        }
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
                                            <Form.Group controlId="Name" className='mb-3'>
                                                <Form.Label>ชื่อ</Form.Label>
                                                <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
                                                {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}
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

export default EditMember