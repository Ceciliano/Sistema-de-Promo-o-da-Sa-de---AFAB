/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import InputMaskUnform from '~/components/InputMaskUnform';

import { Container, ModalContent, DivBoxRow, DivBoxColumn } from '~/styles/styles';

const schema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O Título deve ter no mínimo três letras')
    .required('O Título é obrigatório')
});

export default function Create({ handleClose, handleSave }) {

  const newPlan = {
    title: ''
  }

  const [plan, setPlan] = useState(newPlan);
  const [errorApi, setErrorApi] = useState(null);
  const [total, setTotal] = useState(0);

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

  async function handleInternalClose() {
    await setPlan(newPlan);
    handleClose();
  }

  async function handleInternalSave(data) {
    try {
      const response = await api.post('/plans', data);
      handleSave(response.data);
      handleInternalClose();
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
          context={{ total }}
        >
          <header>
            <h1>Cadastro de Comportamentos/Aspectos</h1>
            <div className="buttons">
              <button
                type="button"
                className="close"
                onClick={handleInternalClose}
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
          </div>
        </Form>
      </ModalContent>
    </Container>
  );
}

Create.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};
