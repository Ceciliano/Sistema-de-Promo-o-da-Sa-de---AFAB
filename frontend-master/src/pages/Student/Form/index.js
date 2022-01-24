/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input } from '@rocketseat/unform';
import { differenceInYears, format, subYears } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DatePicker from '~/components/DatePicker';
import InputMaskUnform from '~/components/InputMaskUnform';
import ReactSelect from '~/components/ReactSelect';
import {
  ButtonClose, Buttons,
  ButtonSave, Container, DivBoxColumn, DivBoxRow, ModalContent
} from '~/styles/styles';

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
  telefone: Yup.string(),
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

export default function EditForm({ title, handleSave, handleClose, oldStudent }) {
  const newStudent = {
    name: '',
    email: '',
    birthday: new Date(),
    height: '',
    weight: '',
    telefone: '',
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
  
  const selectStudent = oldStudent? oldStudent:newStudent;
  
  const student = {
    ...selectStudent,
    birthday: new Date(selectStudent.birthday),
    height: Number(selectStudent.height / 100).toFixed(2),
    weight: `00${Number(selectStudent.weight / 100).toFixed(2)}`.substr(-6),
  };
  const [errorApi, setErrorApi] = useState(null);
  const [age, setAge] = useState(student.age);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Aluno não atualizado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Aluno não atualizado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function handleInternalSave(data) {
    try {
      data = {
        ...data,
        height: data.height * 100,
        weight: data.weight * 100,
        birthday: format(data.birthday, 'yyyy-MM-dd'),
      };

      handleSave(data);
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
            <h1>{title}</h1>
            <Buttons>
              <ButtonClose
                type="button"
                className="close"
                onClick={() => handleClose()}
              >
                <MdKeyboardArrowLeft color="#fff" size={16} />
                Voltar
              </ButtonClose>
              <ButtonSave type="submit" className="save">
                <MdDone color="#fff" size={16} />
                Atualizar
              </ButtonSave>
            </Buttons>
          </header>

          <hr />

          <div className="content">
            <label>Nome Completo</label>
            <Input type="text" name="name" placeholder="John Doe" />

            <label>Endereço de e-mail</label>
            <Input type="email" name="email" placeholder="exemplo@email.com" />

            <DivBoxRow>
              <DivBoxColumn>
                <label>
                  Telefone
                </label>
                <InputMaskUnform
                  name="telefone"
                  mask="(99)99999-9999"
                  type="text"
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>
                  Idade {age ? <span className="age">{age} anos</span> : null}
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

EditForm.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  oldStudent: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    birthday: PropTypes.string,
    weight: PropTypes.number,
    height: PropTypes.number,
    telefone: PropTypes.string,
    atividades: PropTypes.string,
    naturalidade: PropTypes.string,
    religiao: PropTypes.string,
    raca: PropTypes.string,
    estadocivil: PropTypes.string,
    escolaridade: PropTypes.string,
    rendafamiliar: PropTypes.string,
    doencascronicas: PropTypes.string,
    niveldependencia: PropTypes.string,
  }),
};
