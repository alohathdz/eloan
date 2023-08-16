import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

function ShowMember() {

    const [details, setDetails] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getDetails();
    }, []);

    const getDetails = async () => {
        await axios.get(`http://localhost:8081/member/detail/${id}`).then(({ data }) => {
            setDetails(data);
        });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="float-start">
                        <h4>รายการกู้</h4>
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
                                                <td>{row.start_date}</td>
                                                <td></td>
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