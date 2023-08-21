import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment/min/moment-with-locales'

function ShowMember() {

    const [details, setDetails] = useState([]);
    const [name, setName] = useState('');
    const { id } = useParams();

    useEffect(() => {
        getDetails();
        getName();
    }, []);

    const getDetails = async () => {
        await axios.get(`http://localhost:8081/member/detail/${id}`).then(({ data }) => {
            setDetails(data);
        });
    }

    const getName = async () => {
        await axios.get(`http://localhost:8081/member/edit/${id}`)
        .then(res => {
            setName(res.data[0].name);
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
                getDetails();
            }).catch(err => console.log(err))
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="float-start">
                        <h4>รายการกู้ของ {name}</h4>
                    </div>
                    <div className="float-end">
                        <Link className="btn btn-sm btn-primary mb-2 me-1" to={`/member/loan/create/${id}`}>
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
                                        <th>ยอดกู้</th>
                                        <th>ดอกเบี้ย</th>
                                        <th>วันที่กู้</th>
                                        <th>วันชำระยอด</th>
                                        <th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.length > 0 ? (
                                        details.map((row, key) => (
                                            <tr key={key}>
                                                <td>{row.detail_id}</td>
                                                <td>{row.amount}</td>
                                                <td>{row.amount / 100 * row.rate}</td>
                                                <td>{moment(row.start_date).locale('th').add(543, 'years').format('ll')}</td>
                                                <td>{moment(row.pay_date).locale('th').add(543, 'years').format('ll')}</td>
                                                <td>
                                                    <Link to={`/loan/edit/${row.detail_id}`} className='btn btn-sm btn-warning me-2'>แก้ไข</Link>
                                                    <Button className='btn btn-sm btn-danger' onClick={e => handleDelete(row.detail_id)}>ลบ</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">ไม่พบข้อมูลการกู้</td>
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

export default ShowMember