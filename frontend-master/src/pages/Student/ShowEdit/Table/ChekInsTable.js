import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { Container, TableBox } from './styles';
import LoadingIndicator from '~/components/LoadingIndicator';

export default function CheckInsTable({ studentId }) {
  const [consults, setConsults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadConsults() {
      try {
        const { data } = await api.get(`/students/${studentId}/consults`);

        const {
          consults: _consults,
          total: _total,
        } = data;

        setConsults(_consults);
        setTotal(_total);
        setLoading(false);
      } catch (error) {
        console.tron.error(error);
      }
    }
    setLoading(true);
    loadConsults();
  }, [studentId]);

  return (
    <Container>
      <h2>
        Consultas:{' '}
      </h2>

      {loading ? (
          <LoadingIndicator size={40} />
        ) : (consults.length ? (
          <TableBox>
            <div>
              <p>
                <span>Total de registros: {total}</span>
              </p>
            </div>
            <table>
              <thead>
                <tr>
                  <th className="text-left" width="220">
                    Data
                  </th>
                  <th className="text-left">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody>
                {consults.map(c => (
                  <tr key={c.id}>
                    <td>{c.createdAt}</td>
                    <td>{c.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableBox>
          ) : <span>Sem Consultas</span>)
      }
    </Container>
  );
}

CheckInsTable.propTypes = {
  studentId: PropTypes.number.isRequired,
};
