import React, { useState, useEffect } from 'react';
import Template from '../components/Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import Modal from '../components/Modal';

function DN0101() {
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState({ a: '', b: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://172.16.61.7:3001/api/data');
            setBooks(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }

    const handleNewData = () => {
        setBook({
            a: '',
            b: ''
        });
    }

    const handleSave = async () => {
        try {
            let response;
            if (!book.id) {
                response = await axios.post('http://172.16.61.7:3001/api/data/create', book);
                fetchData();
                document.getElementById('btnClose').click();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "บันทึกสำเร็จ",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                response = await axios.put(`http://172.16.61.7:3001/api/data/edit/${book.id}`, book);
                fetchData();
                document.getElementById('btnClose').click();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "บันทึกสำเร็จ",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            if (response.data.message === 'success') {
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }

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
                    const response = await axios.delete(`http://172.16.61.7:3001/api/data/${item.id}`);
                    if (response.data.message === 'success') {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "บันทึกสำเร็จ",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    fetchData();
                    document.getElementById('btnClose').click();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "บันทึกสำเร็จ",
                        showConfirmButton: false,
                        timer: 1500
                    });
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
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>รหัสตัวชีวัด DN0101</h1>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">ร้อยละการเสียชีวิตของผู้ป่วย Stroke</h3>
                                            <div className="d-flex justify-content-end">
                                                <button onClick={handleNewData} className="btn btn-primary" data-target='#modalForm' data-toggle='modal'>
                                                    <i className="fa fa-plus" style={{ marginRight: '10px' }}></i>
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
                                                                <th>Date</th>
                                                                <th>A</th>
                                                                <th>B</th>
                                                                <th>ค่าเฉลี่ย</th>
                                                                <th width="10%">Action </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {books.map(item =>
                                                                <tr key={item.id}>
                                                                    <td>{item.date}</td>
                                                                    <td>{item.a}</td>
                                                                    <td>{item.b}</td>
                                                                    <td>{parseInt((item.a / item.b) * 100)}</td>
                                                                    <td>
                                                                        <button onClick={() => setBook(item)} className="btn btn-info" data-toggle='modal' data-target='#modalForm' style={{ marginRight: '3px' }}>Edit</button>
                                                                        <button onClick={() => handleDelete(item)} className="btn btn-danger">Delete</button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    : <p>No data available</p>}
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
                    <input className="form-control" type="text" name="a" value={book.a} onChange={(e) => setBook({ ...book, a: e.target.value })} />
                </div>
                <div className="mt-2">
                    <label>B</label>
                    <input className="form-control" type="text" name="b" value={book.b} onChange={(e) => setBook({ ...book, b: e.target.value })} />
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
