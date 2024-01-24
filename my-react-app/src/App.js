import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3001/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data);
        // ทำการดึงข้อมูลใหม่หลังจากนำเข้าข้อมูล
        axios.get('http://localhost:3001/api/data')
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddData = () => {
    axios.post('http://localhost:3001/api/data', { name, email })
      .then(response => {
        console.log(response.data);
        // ทำการดึงข้อมูลใหม่หลังจากเพิ่มข้อมูล
        axios.get('http://localhost:3001/api/data')
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>CRUD Example with React, Node.js, and MySQL</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name} - {item.email}</li>
        ))}
      </ul>
      <div>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleAddData}>Add Data</button>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

        
      </div>
    </div>
  );
}

export default App;
