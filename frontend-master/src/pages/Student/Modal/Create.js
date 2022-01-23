/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { differenceInYears, format, subYears } from 'date-fns';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import ReactSelect from '~/components/ReactSelect';

import * as Yup from 'yup';

import api from '~/services/api';

import DatePicker from '~/components/DatePicker';
import InputMaskUnform from '~/components/InputMaskUnform';

import { DivBoxRow, DivBoxColumn } from '~/styles/styles';
import { Container, ModalContent } from './styles';

const schema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'O Nome deve ter no mínimo três letras')
    .required('O Nome é obrigatório'),
  email: Yup.string()
    .email('Use um email válido')
    .required('O e-mail é obrigatório'),
  birthday: Yup.date()
    .required('A data de nascimento é obrigatória')
    .max(subYears(new Date(), 10), 'Somente para maiores de 10 anos'),
  weight: Yup.number()
    .min(35.0, 'O Peso deve ser no mínimo de 35Kg')
    .required('O Peso é obrigatório'),
  height: Yup.number()
    .min(1.0, 'A Altura deve ser no mínimo de 1 metro')
    .required('A Altura é obrigatória'),
  atividades: Yup.string(),
  naturalidade: Yup.string(),
  religiao: Yup.string(),
  raca: Yup.string(),
  estadocivil: Yup.string(),
  escolaridade: Yup.string(),
  rendafamiliar: Yup.string(),
  doencascronicas: Yup.string(),
  niveldependencia: Yup.string(),
});

export default function Create({ handleClose, handleSave }) {
  const newStudent = {
    name: '',
    email: '',
    birthday: new Date(),
    height: '',
    weight: '',
    atividades: '',
    naturalidade: '',
    religiao: '',
    raca: '',
    estadocivil: '',
    escolaridade: '',
    rendafamiliar: '',
    doencascronicas: '',
    niveldependencia: '',
    age: null,
  };
  const [student, setStudent] = useState(newStudent);
  const [errorApi, setErrorApi] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Aluno não cadastrado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Aluno não cadastrado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function handleInternalClose() {
    await setStudent(newStudent);
    handleClose();
  }

  async function handleInternalSave(data) {
    try {
      data = {
        ...data,
        height: data.height * 100,
        weight: data.weight * 100,
        birthday: format(data.birthday, 'yyyy-MM-dd'),
      };

      const response = await api.post('/students', data);

      handleSave(response.data);

      handleInternalClose();
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
    }
  }

  function handleDatePickerChange(date) {
    setAge(differenceInYears(new Date(), date));
  }

  return (
    <Container>
      <ModalContent>
        <Form
          schema={schema}
          initialData={student}
          onSubmit={handleInternalSave}
          context={{ age }}
        >
          <header>
            <h1>Cadastrar Idosa</h1>
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
            <label>*Nome Completo</label>
            <Input type="text" name="name" placeholder="John Doe" />

            <label>Endereço de e-mail</label>
            <Input type="email" name="email" placeholder="exemplo@email.com" />

            <DivBoxRow>
              <DivBoxColumn>
                <label>
                  *Idade {age ? <span className="age">{age} anos</span> : null}
                </label>
                <DatePicker name="birthday" onChange={handleDatePickerChange} />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>
                  Peso <span>(em kg)</span>
                </label>
                <InputMaskUnform name="weight" mask="999.9" type="text" />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Altura</label>
                <InputMaskUnform name="height" mask="9.99" type="text" />
              </DivBoxColumn>
            </DivBoxRow>

            <label>Atividades grupais de saúde</label>
            <Input
              type="text"
              name="atividades"
              placeholder="Dança, Passeios, Artesanato, Musculação"
            />

            <DivBoxRow>
              <DivBoxColumn>
                <label>Naturalidade</label>
                <Input
                  type="text"
                  name="naturalidade"
                  placeholder="Brasileira"
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <ReactSelect
                  name="religiao"
                  label="*Religião/crença"
                  options={[
                    { id: 'catolica', title: 'Católica' },
                    { id: 'evangelica', title: 'Evangélica' },
                    { id: 'espirita', title: 'Espírita' },
                    { id: 'testemunhadejeova', title: 'Testemunha de Jeová' },
                    { id: 'outras', title: 'Outras' },
                  ]}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <ReactSelect
                  name="raca"
                  label="Raça/cor"
                  options={[
                    { id: 'branca', title: 'Branca' },
                    { id: 'negra', title: 'Negra' },
                    { id: 'mulata', title: 'Parda/mulata' },
                    { id: 'amarela', title: 'Amarela' },
                    { id: 'indigena', title: 'Indígena ou de origem indígena' },
                  ]}
                />
              </DivBoxColumn>
            </DivBoxRow>

            <DivBoxRow>
              <DivBoxColumn>
                <ReactSelect
                  name="estadocivil"
                  label="*Estado Civil"
                  options={[
                    { id: 'solteira', title: 'Solteira' },
                    { id: 'casada', title: 'Casada' },
                    { id: 'divorciada', title: 'Divorciada' },
                    { id: 'viuva', title: 'Viúva' },
                  ]}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <ReactSelect
                  name="escolaridade"
                  label="Escolaridade"
                  options={[
                    { id: 'nenhuma', title: 'Nenhuma' },
                    { id: 'ensinofundamental', title: 'Ensino Fundamental' },
                    { id: 'ensinomedio', title: 'Ensino Médio' },
                    { id: 'tecnico', title: 'Ensino Médio - Técnico' },
                    { id: 'ensinosuperior', title: 'Ensino Superior' },
                  ]}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <ReactSelect
                  name="rendafamiliar"
                  label="*Renda familiar"
                  options={[
                    { id: 'ate2sm', title: 'Até 2 SM' },
                    { id: 'de2a5sm', title: 'De 2 a 5 SM' },
                    { id: 'maisde5sm', title: 'Mais de 5 SM' },
                  ]}
                />
              </DivBoxColumn>
            </DivBoxRow>

            <label>*Doenças crônicas</label>
            <Input
              type="text"
              name="doencascronicas"
              placeholder="Hipertensão Arterial, Diabettes tipo 1, Diabetes tipo 2"
            />
            <label>
              *Nível de dependência para Atividades Básicas para Vida
            </label>
            <Input
              type="text"
              name="niveldependencia"
              placeholder="Escovar os dentes, Pentear os cabelos, Vestir-se, Tomar banho"
            />
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
