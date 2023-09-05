import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams, Link } from 'react-router-dom'
import moment from 'moment/min/moment-with-locales'

function CreatePay() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [interest, setInterest] = useState('');
    const [pays, setPays] = useState([]);
    const [values, setValues] = useState({
        loan: '',
        interest: '',
        pay_date: '',
        id: id
    });
    let i = 0;

    useEffect(() => {
        getLoan();
        getPays();
    }, [])

    const getLoan = async () => {
        await axios.get('http://localhost:8081/LoanList/' + id)
            .then(res => {
                setName(res.data[0].name);
                setBalance(res.data[0].balance);
                setInterest(res.data[0].interest);
            }).catch(err => console.log(err))
    }

    const getPays = async () => {
        await axios.get('http://localhost:8081/PayList/' + id).then(({ data }) => {
            setPays(data);
        }).catch(err => console.log(err))
    }

    const handleCreate = async (e) => {
        e.preventDefault();

        await axios.post('http://localhost:8081/pay/create', values)
            .then(res => {
                console.log(res);
                Swal.fire({
                    icon: "success",
                    text: "การชำระยอด สำเร็จ!"
                })

                navigate(-1);
            }).catch(err => console.log(err))
    }

    const handleDelete = async (id) => {
        const isConfirm = await Swal.fire({
            title: "ยันยันการลบข้อมูล",
            text: "เมื่อยันแล้ว ข้อมูลจะหายไป",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            return result.isConfirmed
        })

        if (!isConfirm) {
            return;
        }

        await axios.delete('http://localhost:8081/pay/delete/' + id)
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Delete Payment Success!"
                })
                getLoan();
                getPays();
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
                                                <Form.Label>ชำระเงินต้น <font color="red">( {balance} )</font></Form.Label>
                                                <Form.Control type="number" onChange={e => setValues({ ...values, loan: e.target.value })} required/>
                                            </Form.Group>
                                            <Form.Group controlId="Interest" className='mb-3'>
                                                <Form.Label>ชำระดอกเบี้ย <font color="red">( {interest} )</font></Form.Label>
                                                <Form.Control type="number" onChange={e => setValues({ ...values, interest: e.target.value })} required/>
                                            </Form.Group>
                                            <Form.Group controlId="PayDate" className='mb-3'>
                                                <Form.Label>วันที่ชำระ</Form.Label>
                                                <Form.Control type="date" onChange={e => setValues({ ...values, pay_date: e.target.value })} required/>
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
                <Table responsive bordered hover className='text-center mt-5'>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>วันที่ชำระ</th>
                            <th>เงินต้น</th>
                            <th>ดอกเบี้ย</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pays.length > 0 ? (
                            pays.map((row, key) => (
                                <tr key={key}>
                                    <td>{++i}</td>
                                    <td>{moment(row.pay_date).locale('th').add(543, 'years').format('ll')}</td>
                                    <td>{row.loan}</td>
                                    <td>{row.interest}</td>
                                    <td>
                                        <Link to={'/pay/edit/' + row.payment_id} className='btn btn-sm btn-warning me-2'>แก้ไข</Link>
                                        <Button variant='danger' size='sm' onClick={e => handleDelete(row.payment_id)}>ลบ</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">ไม่พบข้อมูล</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default CreatePay