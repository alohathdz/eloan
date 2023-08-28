import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

function ShowMember() {

    const [members, setMembers] = useState([]);
    const [memberID, setMemberID] = useState([]);
    let i = 0;

    useEffect(() => {
        getMembers();
    }, []);

    const getMembers = async () => {
        await axios.get(`http://localhost:8081/member`).then(({ data }) => {
            setMembers(data);
        });
    }

    let sum_balance = 0;
    let sum_interest = 0;

    members.forEach(row => {
        sum_balance += row.balance;
        sum_interest += row.interest;
    });

    var nf = new Intl.NumberFormat();

    const checkDueDate = async () => {
        await axios.get('http://localhost:8081/CheckDueDate').then(({ data }) => {
            setMemberID(data);
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

        await axios.delete(`http://localhost:8081/member/delete/${id}`)
            .then(res => {
                Swal.fire({
                    icon: "success",
                    text: "Delete successfully!"
                })
                getMembers();
            }).catch(err => console.log(err))
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="float-start">
                        <h4>รายชื่อผู้กู้</h4>
                    </div>
                    <div className="float-end">
                        <Link className="btn btn-sm btn-primary mb-2 me-1" to={"/member/create"}>
                            เพิ่มผู้กู้
                        </Link>
                        <Link className="btn btn-sm btn-secondary mb-2" to={"/"}>
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
                                        <th>ชื่อ</th>
                                        <th>เงินต้น</th>
                                        <th>ดอกเบี้ย</th>
                                        <th>จ่ายต้น</th>
                                        <th>จ่ายดอก</th>
                                        <th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.length > 0 ? (
                                        members.map((row, key) => (
                                            <tr key={key}>
                                                <td>{++i}</td>
                                                <td>{row.name}</td>
                                                <td>{row.balance ? (nf.format(row.balance)) : ("-")}</td>
                                                <td>{row.interest ? (nf.format(row.interest)) : ("-")}</td>
                                                <td>{row.pay_loan ? (nf.format(row.pay_loan)) : ("-")}</td>
                                                <td>{row.pay_interest ? (nf.format(row.pay_interest)) : ("-")}</td>
                                                <td>
                                                    <Link to={`/loan/${row.member_id}`} className='btn btn-info btn-sm'>การกู้</Link>
                                                    <Link to={`/member/edit/${row.member_id}`} className='btn btn-sm btn-warning mx-2'>แก้ไข</Link>
                                                    <Button className='btn btn-danger btn-sm' onClick={e => handleDelete(row.member_id)}>ลบ</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">ไม่พบข้อมูลผู้กู้</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan={2}>รวม</td>
                                        <td>{nf.format(sum_balance)}</td>
                                        <td>{nf.format(sum_interest)}</td>
                                    </tr>
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