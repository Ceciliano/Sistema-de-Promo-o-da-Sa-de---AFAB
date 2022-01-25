/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import LoadingIndicator from '~/components/LoadingIndicator';
import * as Yup from 'yup';
import AssyncSelect from '~/components/AssyncSelect';
import api from '~/services/api';
import { Container, DivBoxColumn, DivBoxRow, ModalContent, Loading } from '~/styles/styles';

var schema = Yup.object().shape({
  respostas: Yup.array().of(
    Yup.object().shape({
      id: Yup.number(),
    })
  )
});

export default function ConsultForm({ title, name, handleSave, handleClose, oldConsults }) {
  const newConsults = { title: '', respostas:[{ title: '' }] }
  const [consults, setConsults] = useState(oldConsults? oldConsults:newConsults);
  const [perguntas, setPerguntas] = useState([{title:'teste'}]);
  const [errorApi, setErrorApi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerguntas();
  }, []);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Resultado não cadastrado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Resultado não cadastrado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function loadPerguntas() {
    const response = await api.get(`/plans?page=1&limit=100&q=&name=`);
    const {
      plans: _plans,
    } = response.data;

    setPerguntas(_plans);
    setLoading(false);
  }

  async function handleInternalSave(data) {
    try {
      handleSave(data);
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
    }
  }

  function handleComportamentosChange(data, id) {
    return new Promise((resolve, reject) => {
      api.get(`/respostas?page=1&limit=100&q=${data}&plan_id=${id}&active=0`)
        .then(result => {
          const { respostas } = result.data;
          if (respostas.length > 0) {
            resolve(respostas.map(s => ({ value: s.id, label: s.title })));
          }
        })
        .catch(error => reject(error));
    });
  }

  return (
    <Container>
      <ModalContent>
        <Form
          schema={schema}
          initialData={consults}
          onSubmit={handleInternalSave}
        >
          <header>
            <h1>{title}</h1>
            <div className="buttons">
              <button
                type="button"
                className="close"
                onClick={() => handleClose()}
              >
                <MdKeyboardArrowLeft color="#fff" size={16} />
                Voltar
              </button>

              <button type="submit" className="save">
                <MdDone color="#fff" size={16} />
                Salvar
              </button>
            </div>
          </header>

          <hr />

          <div className="content">
            <h1>{name}</h1>
            {loading ? (
              <Loading>
                <LoadingIndicator size={40} />
              </Loading>
            ) : (
              <>
                {perguntas.map(p => (
                  <DivBoxRow key={p.id}>
                    <DivBoxRow>
                      <DivBoxColumn>
                        {p.title}
                      </DivBoxColumn>
                      <DivBoxColumn>
                        <AssyncSelect
                          name={`respostas.${p.id}.id`}
                          label="Resposta"
                          promiseOptions={data=>handleComportamentosChange(data, p.id)}
                        />
                      </DivBoxColumn>
                    </DivBoxRow>
                  </DivBoxRow>
                ))}
              </>
            )}
          </div>
        </Form>
      </ModalContent>
    </Container>
  );
}

ConsultForm.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectResults: PropTypes.shape({
    title: PropTypes.string,
    respostas: PropTypes.array,
  })
};