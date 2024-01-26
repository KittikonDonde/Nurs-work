import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Navbar() {
    const navigate = useNavigate();
    const [logoutConfirm, setLogoutConfirm] = useState(false);

    const handleLogout = () => {
        if (logoutConfirm) {
            // ยืนยันการออกจากระบบ ลบข้อมูลและเปลี่ยนเส้นทางไปยังหน้าหลัก
            localStorage.removeItem('loggedIn');
        } else {
            // แสดงกล่องยืนยันก่อนที่จะออกจากระบบ
            Swal.fire({
                title: 'ยืนยันการออกจากระบบ',
                text: 'คุณแน่ใจหรือไม่ที่ต้องการออกจากระบบ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ออกจากระบบ',
                cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {
                    setLogoutConfirm(true);
                    navigate('/');
                }
            });
        }
    };

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
               
            </ul>

            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-danger">
                        Logout
                        &nbsp;
                        <i className="fa fa-arrow-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
