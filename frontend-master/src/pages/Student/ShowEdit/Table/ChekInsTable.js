import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { Container } from './styles';


export default function CheckInsTable({ studentId }) {
  const [consults, setConsults] = useState([]);

  useEffect(() => {
    async function loadConsults() {
      try {
        const { data } = await api.get(`/students/${studentId}/consult`);
        setConsults(data)
      } catch (error) {
        console.tron.error(error);
      }
    }

    loadConsults();
  }, [studentId]);

  return (
    <Container>
      <h2>
        Consultas:{' '}
        {consults.length ? (
          consults.length
        ) : (
          <span>Sem Consultas</span>
        )}
      </h2>

      {consults.length ? (
        {consults}
      ) : null}
    </Container>
  );
}

CheckInsTable.propTypes = {
  studentId: PropTypes.number.isRequired,
};
