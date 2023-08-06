import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

function ShowMember() {

    const [members, setMembers] = useState([]);

    useEffect(() => {
        getMembers();
    }, []);

    const getMembers = async () => {
        await axios.get(`http://localhost:8081/member`).then(({ data }) => {
            setMembers(data);
        });
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
                                        <th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.length > 0 ? (
                                        members.map((row, key) => (
                                            <tr key={key}>
                                                <td>{row.member_id}</td>
                                                <td>{row.name}</td>
                                                <td>
                                                    <Link to={`/member/detail/${row.member_id}`} className='btn btn-info btn-sm'>การกู้</Link>
                                                    <Link to={`/member/edit/${row.member_id}`} className='btn btn-sm btn-warning mx-2'>แก้ไข</Link>
                                                    <Button className='btn btn-danger btn-sm'>ลบ</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">ไม่พบข้อมูลผู้กู้</td>
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