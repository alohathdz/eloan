import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Home() {

    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }, [])

    return (
        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ชื่อ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((member, index) => {
                            return <tr key={index}>
                                <td>{member.member_id}</td>
                                <td>{member.name}</td>
                                <td>
                                    <button>แก้ไข</button>
                                    <button>ลบ</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home