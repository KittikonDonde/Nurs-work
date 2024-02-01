import React, { useState, useEffect } from 'react';
import Template from '../components/Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import Modal from '../components/Modal';
import ReactPaginate from 'react-paginate';

function DN0101() {
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState({ monthYear: '', a: '', b: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // จำนวนรายการที่ต้องการแสดงต่อหน้า

    useEffect(() => {
        fetchData();
    }, [currentPage]); // เรียกใช้ fetchData เมื่อ currentPage เปลี่ยนแปลง

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
            } else {
                response = await axios.put(`http://172.16.61.7:3001/api/data/edit/${book.id}`, book);
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
    

    const handleDelete = async (item) => {
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
                    fetchData();
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

    // คำนวณหน้าทั้งหมด
    const totalPages = Math.ceil(books.length / itemsPerPage);

    // คำนวณ index ของ items ที่ต้องแสดงในหน้าปัจจุบัน
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, books.length);
    const currentPageItems = books.slice(startIndex, endIndex);

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
                                                {currentPageItems.length > 0 ?
                                                    <table id="myDataTable" className="table table-bordered table-striped mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th>เดือน / ปี</th>
                                                                <th>A</th>
                                                                <th>B</th>
                                                                <th>ค่าเฉลี่ย</th>
                                                                <th width="10%">Action </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentPageItems.map(item =>
                                                                <tr key={item.id}>
                                                                    <td>{item.monthYear}</td>
                                                                    <td>{item.a}</td>
                                                                    <td>{item.b}</td>
                                                                    <td>{parseInt((item.a / item.b) * 100)}</td>
                                                                    <td>
                                                                        <button onClick={() => setBook(item)} className="btn btn-warning" data-toggle='modal' data-target='#modalForm' style={{ marginRight: '3px' }}>Edit</button>
                                                                        <button onClick={() => handleDelete(item)} className="btn btn-danger">Delete</button>
                                                                    </td>

                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    : <p>No data available</p>}
                                                <ReactPaginate
                                                    previousLabel={'Previous'}
                                                    nextLabel={'Next'}
                                                    breakLabel={'...'}
                                                    pageCount={totalPages}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={(selected) => setCurrentPage(selected.selected)}
                                                    containerClassName={'pagination mt-3  justify-content-end'} // เพิ่ม justify-content-end เพื่อให้ pagination ชิดฝั่งขวา
                                                    activeClassName={'active'}
                                                    previousClassName={'page-item'}
                                                    nextClassName={'page-item'}
                                                    pageClassName={'page-item'}
                                                    breakClassName={'page-item'}
                                                    pageLinkClassName={'page-link'}
                                                    previousLinkClassName={'page-link'}
                                                    nextLinkClassName={'page-link'}
                                                    breakLinkClassName={'page-link'}
                                                />
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
                    <label>Month Year</label>
                    <input className="form-control" type="text" name="monthYear" value={book.monthYear} onChange={(e) => setBook({ ...book, monthYear: e.target.value })} />
                </div>

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
            {/* Pagination */}

        </>
    );
}

export default DN0101;
