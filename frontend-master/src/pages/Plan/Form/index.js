/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input } from '@rocketseat/unform';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Container, DivBoxColumn, DivBoxRow, ModalContent } from '~/styles/styles';

var schema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O Título deve ter no mínimo três letras')
    .required('O Título é obrigatório'),
  respostas: Yup.array().of(
    Yup.object().shape({
      title: Yup.string(),
    })
  )
});

export default function EditForm({ title, handleSave, handleClose, oldPlan }) {
  const newPlan = { title: '', respostas:[{ title: '' },{ title: '' }] }
  const [plan, setPlan] = useState(oldPlan? oldPlan:newPlan);
  const [errorApi, setErrorApi] = useState(null);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Plano não cadastrado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Plano não cadastrado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function handleAddInput() {
    setPlan({ ...plan, respostas: [...plan.respostas, newPlan.respostas[0]] });
  }

  async function handleLessInput(_item) {
    plan.respostas.splice(_item, 1);
    setPlan({ ...plan });
  }

  async function handleInternalSave(data) {
    try {
      handleSave(data);
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
    }
  }

  return (
    <Container>
      <ModalContent>
        <Form
          schema={schema}
          initialData={plan}
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
            <label>Pergunta do Comportamentos/Aspectos</label>
            <Input type="text" name="title" />
            <DivBoxRow>
              {plan.respostas.map(function(object, i){
                  return(
                      <DivBoxColumn key={i}>
                        <label>Resposta {i + 1}</label>
                        <Input type="text" name={`respostas.${i}.title`} />
                      </DivBoxColumn>
                    );
              })}
              {plan.respostas.length > 2 &&
                  <button
                    className="delete-button"
                    type="button"
                    onClick={()=>handleLessInput(plan.respostas.length-1)}
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
  selectPlan: PropTypes.shape({
    title: PropTypes.string,
    respostas: PropTypes.array,
  })
};
