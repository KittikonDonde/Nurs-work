import React from 'react';
import { useState, useEffect } from "react";
import Template from '../components/Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import Modal from '../components/Modal';



function DN0101() {

    const [formData, setFormData] = useState({ a: '', b: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [books, setBooks] = useState([]);
    const [book, setBook] = useState({});


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get('http://172.16.61.7:3001/api/data').then(res => {
                setBooks(res.data);
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const handleNewData = () => {
        setBook({
            a: '',
            b: ''
        })
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/data/create', formData);
            console.log('Data inserted successfully:', response.data);
            // ทำตามขั้นตอนที่ต้องการหลังจากบันทึกข้อมูลเช่นแสดงข้อความ success, ล้างฟอร์ม, รีเฟรชข้อมูล, เปลี่ยนหน้า, ฯลฯ
            fetchData();
            document.getElementById('btnClose').click();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false,
                timer: 1500
            });
            document.getElementById('modalForm').modal('hide');

        } catch (error) {
            console.error('There was a problem inserting data:', error);
        }
    };

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete Product',
            text: 'Are you sure to delete?',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:3001/api/data/${item.id}`);
                    if (response.data.message === 'success') {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchData();

                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: error.message,
                        icon: 'error'
                    });
                }
            }
        });
    }

    return (
        <>
            <Template>
                <div>
                    <section class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-sm-6">
                                    <h1>รหัสตัวชีวัด DN0101</h1>
                                </div>

                            </div>
                        </div>
                    </section>

                    <section class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h3 class="card-title">ร้อยละการเสียชีวิตของผู้ป่วย Stroke</h3>
                                            <div className="d-flex justify-content-end">
                                                <button onClick={handleNewData} className="btn btn-primary" data-target='#modalForm' data-toggle='modal'>
                                                    <i className="fa fa" style={{ marginRight: '10px' }}></i>
                                                    เพิ่มรายการ
                                                </button>
                                            </div>

                                        </div>

                                        <div className="card">
                                            <div className="card-body">

                                                {books.length > 0 ?
                                                    <table className="table table-bordered table-stiped mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th >date</th>
                                                                <th >A</th>
                                                                <th>B</th>
                                                                <th>ค่าเฉลี่ย</th>
                                                                <th width="10%"></th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {books.map(item =>
                                                                <tr>
                                                                    <td>{ }</td>
                                                                    <td>{item.a}</td>
                                                                    <td>{item.b}</td>
                                                                    <td>{parseInt((item.a / item.b) * 100)}</td>

                                                                    <td >
                                                                        <button
                                                                            data-toggle='modal'
                                                                            data-target='#modalForm'

                                                                            className="btn btn-info"
                                                                            style={{ marginRight: '3px' }}>
                                                                            <i className="fa fa-pencil"></i>
                                                                        </button>
                                                                        <button
                                                                            data-toggle='modal'
                                                                            data-target='#modalInfo'
                                                                            className="btn btn-success"
                                                                            style={{ marginRight: '5px' }}>
                                                                            <i className="fa fa-file"></i>
                                                                        </button>
                                                                        <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                                            <i className="fa fa-times"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    :
                                                    ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </Template>
            <Modal id='modalForm' title='ข้อมูลหนังสือ'>
                <div>
                    <label>A</label>
                    <input className="form-control" type="text" name="a" value={formData.a} onChange={handleChange} />
                </div>
                <div className="mt-2">
                    <label>B</label>
                    <input className="form-control" type="text" name="b" value={formData.b} onChange={handleChange} />
                </div>
                <div className="mt-2">
                    <button onClick={handleSave} className="btn btn-primary">
                        <i className="fa fa-check" style={{ marginRight: '10px' }}></i>
                        Save
                    </button>
                </div>
            </Modal>

        </>
    );
}

export default DN0101;
