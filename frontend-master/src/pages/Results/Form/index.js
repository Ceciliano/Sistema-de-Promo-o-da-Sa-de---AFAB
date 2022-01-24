/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import AssyncSelect from '~/components/AssyncSelect';
import api from '~/services/api';
import { Container, DivBoxColumn, DivBoxRow, ModalContent } from '~/styles/styles';

var schema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O Título deve ter no mínimo três letras')
    .required('O Título é obrigatório'),
  respostas: Yup.array().of(
    Yup.object().shape({
      id: Yup.number(),
    })
  )
});

export default function EditForm({ title, handleSave, handleClose, oldResults }) {
  const newResults = { title: '', respostas:[{ title: '' }] }
  const [results, setResults] = useState(oldResults? oldResults:newResults);
  const [errorApi, setErrorApi] = useState(null);

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

  async function handleInternalSave(data) {
    try {
      handleSave(data);
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
    }
  }

  function getPromisse(inputValue) {
    return new Promise((resolve, reject) => {
      api
        .get(`/plans?page=1&limit=100&q=${inputValue}&active=0`)
        .then(result => {
          const { plans } = result.data;
          if (plans.length > 0) {
            resolve(plans.map(s => ({ value: s.id, label: s.title })));
          }
        })
        .catch(error => reject(error));
    });
  }

  function handleComportamentosChange(data) {
    return new Promise((resolve, reject) => {
      api
        .get(`/respostas?page=1&limit=100&q=${data}&active=0`)
        .then(result => {
          const { respostas } = result.data;
          if (respostas.length > 0) {
            resolve(respostas.map(s => ({ value: s.id, label: s.title })));
          }
        })
        .catch(error => reject(error));
    });
  }

  async function handleAddInput() {
    setResults({ ...results, respostas: [...results.respostas, newResults.respostas[0]] });
  }

  async function handleLessInput(_item) {
    results.respostas.splice(_item, 1);
    setResults({ ...results });
  }

  return (
    <Container>
      <ModalContent>
        <Form
          schema={schema}
          initialData={results}
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
            <label>Resultado</label>
            <Input type="text" name="title" />
            <DivBoxRow>
            {results.respostas.length > 0 && 
              <DivBoxColumn>
                {results.respostas.map(function(object, i){
                  return(
                    <DivBoxRow key={i}>
                      <DivBoxColumn>
                        <AssyncSelect
                          name="student_id"
                          label="Pergunta do Comportamentos/Aspectos"
                          promiseOptions={getPromisse}
                          onChange={handleComportamentosChange}
                        />
                      </DivBoxColumn>
                      <DivBoxColumn>
                        <AssyncSelect
                          name={`respostas.${i}.id`}
                          label="Resposta"
                          promiseOptions={handleComportamentosChange}
                        />
                      </DivBoxColumn>
                    </DivBoxRow>
                  )
                })}
              </DivBoxColumn>}
                {results.respostas.length > 1 &&
                    <button
                      className="delete-button"
                      type="button"
                      onClick={()=>handleLessInput(results.respostas.length-1)}
                    >
                      -
                    </button>
                }
                <button
                  className="neutral-button"
                  type="button"
                  onClick={handleAddInput}
                >
                  +
                </button>
            </DivBoxRow>
          </div>
        </Form>
      </ModalContent>
    </Container>
  );
}

EditForm.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectResults: PropTypes.shape({
    title: PropTypes.string,
    respostas: PropTypes.array,
  })
};
