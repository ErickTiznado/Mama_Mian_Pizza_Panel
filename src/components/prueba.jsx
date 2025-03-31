import React, { useState } from 'react';
import { useEffect } from 'react';

const Prueba = () =>{
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/test/DBprueba')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    },[]);

    return (
      <div>
        <h1>
          {data ? data.message : 'Cargando...'}
          <h3></h3>
        </h1>
      </div>
      );
    }

export default Prueba;