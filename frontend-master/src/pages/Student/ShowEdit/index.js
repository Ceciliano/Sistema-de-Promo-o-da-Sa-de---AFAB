/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input } from '@rocketseat/unform';
import { differenceInYears, parseISO, subYears } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { MdDone, MdExposure, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DatePicker from '~/components/DatePicker';
import InputMaskUnform from '~/components/InputMaskUnform';
import Modal from '~/components/Modal';
import ReactSelect from '~/components/ReactSelect';
import Results from '~/pages/Results';
import api from '~/services/api';
import ConsultForm from './Consult';
import { Container, DivBoxColumn, DivBoxRow } from './styles';
import CheckInTable from './Table/ChekInsTable';


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
    .min(40.0, 'O Peso deve ser no mínimo de 35Kg')
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
  comportamentoanterior: Yup.string(),
});

export default function ShowEdit({ history, location }) {
  const [student, setStudent] = useState({
    ...location.state.student,
    birthday: parseISO(location.state.student.birthday),
    height: Number(location.state.student.height / 100).toFixed(2),
    weight: `00${Number(location.state.student.weight / 100).toFixed(
      2
    )}`.substr(-6),
  });

  const [age, setAge] = useState(student.age);
  const [showCreate, setShowCreate] = useState(location.state.openConsult);

  function handleDatePickerChange(date) {
    setAge(differenceInYears(new Date(), date));
  }

  function handleGoBack() {
    history.push('/students', { currentPage: location.state.currentPage });
  }

  async function handleSubmit({ 
    name, 
    email, 
    birthday, 
    weight, 
    height,
    telefone,
    atividades,
    naturalidade,
    religiao,
    raca,
    estadocivil,
    escolaridade,
    rendafamiliar,
    doencascronicas,
    comportamentoanterior,
    niveldependencia, }) {
    height = (height * 100).toFixed(0);
    weight = (weight * 100).toFixed(0);

    try {
      const response = await api.put(`/students/${student.id}`, {
        name,
        email,
        birthday,
        weight,
        height,
        telefone,
        atividades,
        naturalidade,
        religiao,
        raca,
        estadocivil,
        escolaridade,
        rendafamiliar,
        doencascronicas,
        niveldependencia,
        comportamentoanterior,
      });

      setStudent(response.data);
      toast.success(`Idosa alterada com sucesso! Nome: ${name}`);
    } catch (error) {
      console.tron.error(error);
      toast.error('Erro ao editar o Idosa.');
    }
  }

  async function handleShowCreate() {
    setShowCreate(true);
  }

  function handleClose(_consult) {
    console.log(_consult);
    setShowCreate(false);
  }

  function handleResult(res) {
    setShowCreate(false);
    const {data} = res;

    history.push('/students/show/result', {
      student,
      data,
    });
  }

  async function createStundent(data) {
    return api.post('/students/consults', data);
  }

  function createSucessStudent(res) {
    toast.success(`Consulta realizada com sucesso! Nome: ${student.name}`);
    return res;
  }
  
  return (
    <>
     <Modal visible={showCreate}>
        <ConsultForm student_id={student.id} name={student.name} handleClose={handleClose} handleSave={_consult => 
          createStundent(_consult).then(createSucessStudent).then(handleResult)}
        />
      </Modal>
      <Container>
        <Form
          schema={schema}
          initialData={student}
          onSubmit={handleSubmit}
          context={{ age }}
        >
          <header>
            <h1 style={{color:'#f79b39'}}>Fatores pessoais</h1>
            <div className="buttons">
              <button type="button" className="close" onClick={handleGoBack}>
                <MdKeyboardArrowLeft color="#fff" size={16} />
                Voltar
              </button>

              <button type="button" className="consult" onClick={handleShowCreate}>
                <MdExposure color="#fff" size={16} />
                Aplicar
              </button>

              <button type="submit" className="save">
                <MdDone color="#fff" size={16} />
                Salvar
              </button>
            </div>
          </header>

          <hr />

          <div className="content">
            <DivBoxColumn>
              <label>Nome Completo</label>
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                
              />

              <label>E-mail</label>
              <Input
                type="email"
                name="email"
                placeholder="exemplo@email.com"
                
              />
            </DivBoxColumn>

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
                <DatePicker
                  name="birthday"
                  defaultValue={student.birthday}
                  onChange={handleDatePickerChange}
                  
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>
                  Peso <span>(em kg)</span>
                </label>
                <InputMaskUnform
                  name="weight"
                  mask="999.9"
                  type="text"
                  
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Altura</label>
                <InputMaskUnform
                  name="height"
                  mask="9.99"
                  type="text"
                  
                />
              </DivBoxColumn>
            </DivBoxRow>
            <DivBoxColumn>
              <label>Atividades grupais de saúde</label>
                <Input
                  type="text"
                  name="atividades"
                  placeholder="Dança, Passeios, Artesanato, Musculação"
                  
                />
            </DivBoxColumn>

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
          <DivBoxColumn>
            <label>*Doenças crônicas</label>
            <Input
              type="text"
              name="doencascronicas"
              placeholder="Hipertensão Arterial, Diabettes tipo 1, Diabetes tipo 2"
              
            />
            <label>
              *Desenvolve Atividades Instrumentais de Vida Diária (AIVD)
            </label>
            <Input
              type="text"
              name="niveldependencia"
              placeholder=""
              
            />
          </DivBoxColumn>
        </div>
        <div className="content" style={{padding: '0 30px 30px'}}>
          <DivBoxColumn>  
            <h2 style={{color:'#f79b39'}}>
              Comportamento anterior:
            </h2>
            <ReactSelect
              name="comportamentoanterior"
              options={[
                { id: 'consumoalimentos', title: 'Alimentação/Nutrição: Consumo de alimentos ricos em açúcar e gordura.' },
                { id: 'ingestahidrica', title: 'Alimentação/Nutrição: Ingesta hídrica reduzida.' },
                { id: 'limitacosesfisicas', title: 'Prática Corporal/ Atividade física: Limitações físicas pela doença crônica.' },
                { id: 'ausenciaatividade', title: 'Prática Corporal/ Atividade física: Ausência de atividade física.' },
                { id: 'rendainsuficiente', title: 'Tratamento medicamentoso: Renda insuficiente para custeio com tratamento.' },
                { id: 'dificuldadeaceitacao', title: 'Tratamento medicamentoso: Dificuldade de aceitação ao medicamento.' },
                { id: 'usidetabaco', title: 'Uso de tabaco /outras drogas.' },
              ]}
            />
          </DivBoxColumn>
          </div>
        </Form>
        <CheckInTable studentId={student.id} />
      </Container>
    </>
  );
}

ShowEdit.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      student: PropTypes.object.isRequired,
      currentPage: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
