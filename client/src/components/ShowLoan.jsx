import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment/min/moment-with-locales'

function DetailLoan() {

    const [loans, setLoans] = useState([]);
    const [name, setName] = useState('');
    let i = 0;
    const { id } = useParams();
    var nf = new Intl.NumberFormat();

    useEffect(() => {
        getLoans();
    }, []);

    const getLoans = async () => {
        await axios.get(`http://localhost:8081/loan/${id}`).then(({ data }) => {
            setLoans(data);
            setName(data[0].name);
        })
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

        await axios.delete(`http://localhost:8081/loan/delete/${id}`)
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Delete Loan Success!"
                })
                getLoans();
            }).catch(err => console.log(err))
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="float-start">
                        <h4>รายการกู้ของ <font color="red">{name}</font></h4>
                    </div>
                    <div className="float-end">
                        <Link className="btn btn-sm btn-primary mb-2 me-1" to={`/loan/create/${id}`}>
                            เพิ่มยอดกู้
                        </Link>
                        <Link className="btn btn-sm btn-secondary mb-2" to={"/member"}>
                            ย้อนกลับ
                        </Link>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>วันที่กู้</th>
                                        <th>ยอดกู้</th>
                                        <th>ยอดคงเหลือ</th>
                                        <th>ดอกเบี้ย</th>
                                        <th>วันกำหนดชำระ</th>
                                        <th>ยอดชำระเงินต้น</th>
                                        <th>ยอดชำระดอกเบี้ย</th>
                                        <th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.length > 0 ? (
                                        loans.map((row, key) => (
                                            <tr key={key}>
                                                <td>{++i}</td>
                                                <td>{moment(row.start_date).locale('th').add(543, 'years').format('ll')}</td>
                                                <td>{nf.format(row.amount)}</td>
                                                <td className='text-primary'>{nf.format(row.balance)}</td>
                                                <td className='text-success'>{nf.format(row.balance * (row.rate / 100))}</td>
                                                {moment().format() > moment(row.due_date).format() ? (
                                                    <td className='text-danger'>{moment(row.due_date).locale('th').add(543, 'years').format('ll')}</td>
                                                ) : (
                                                    <td>{moment(row.due_date).locale('th').add(543, 'years').format('ll')}</td>
                                                )}
                                                <td>
                                                    {row.loan ? (nf.format(row.loan)) : ("-")}
                                                </td>
                                                <td>{row.interest ? (nf.format(row.interest)) : ("-")}</td>
                                                <td>
                                                    <Link to={`/pay/create/${row.loan_id}`} className='btn btn-sm btn-success me-2'>ชำระ</Link>
                                                    <Link to={`/loan/edit/${row.loan_id}`} className='btn btn-sm btn-warning me-2'>แก้ไข</Link>
                                                    <Button className='btn btn-sm btn-danger' onClick={e => handleDelete(row.loan_id)}>ลบ</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9">ไม่พบข้อมูลการกู้</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailLoan