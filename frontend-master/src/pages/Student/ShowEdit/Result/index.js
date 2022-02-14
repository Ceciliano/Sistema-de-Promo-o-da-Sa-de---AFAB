/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input } from '@rocketseat/unform';
import { parseISO, subYears } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import InputMaskUnform from '~/components/InputMaskUnform';
import Modal from '~/components/Modal';
import ReactSelect from '~/components/ReactSelect';
import api from '~/services/api';
import ConsultForm from '../Consult';
import { Container, DivBoxColumn, DivBoxRow } from '../styles';


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
  atividadescuidado: Yup.string(),
  atividadessaude: Yup.string(),
  disponibilidadetempo: Yup.string(),
  conhecimentoatitudes: Yup.string(),
  aspectosculturais: Yup.string(),
});

export default function ShowResult({ history, location }) {
  const [student, setStudent] = useState({
    ...location.state.student,
    birthday: parseISO(location.state.student.birthday),
  });

  const [age, ] = useState(student.age);
  const [showCreate, setShowCreate] = useState(location.state.openConsult);

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
    atividadescuidado,
    atividadessaude,
    disponibilidadetempo,
    conhecimentoatitudes,
    aspectosculturais,
    niveldependencia, }) {

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
        atividadescuidado,
        atividadessaude,
        disponibilidadetempo,
        conhecimentoatitudes,
        aspectosculturais,
      });

      setStudent(response.data);
      toast.success(`Idosa alterada com sucesso! Nome: ${name}`);
    } catch (error) {
      console.tron.error(error);
      toast.error('Erro ao editar o Aluno');
    }
  }

  function handleClose(_consult) {
    console.log(_consult);
    setShowCreate(false);

    history.push('/students/show/result', {
      student,
      _consult,
    });
  }

  async function createStundent(data) {
    return api.post('/students/consults', data);
  }

  function createSucessStudent(res) {
    toast.success(`Consulta realizada com sucesso! Nome: ${student.name}`);
  }
  
  return (
    <>
     <Modal visible={showCreate}>
        <ConsultForm student_id={student.id} name={student.name} handleClose={handleClose} handleSave={_consult => 
          createStundent(_consult).then(createSucessStudent).then(handleClose(_consult))}
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
            <h1 style={{color:'#f79b39'}}></h1>
            <div className="buttons">
              <button type="button" className="close" onClick={handleGoBack}>
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
          <DivBoxRow>
            <div className="content" style={{background:'#fff0c4'}}>
              <h2>
                Fatores pessoais:
              </h2>
              <DivBoxColumn>
                <label>Nome Completo</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  disabled={true}
                />

                <label>E-mail</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="exemplo@email.com"
                  disabled={true}
                />
              </DivBoxColumn>

              <DivBoxRow>
                <DivBoxColumn>
                  <label>
                    Telefone:
                  </label>
                  <InputMaskUnform
                    name="telefone"
                    mask="(99)99999-9999"
                    type="text"
                    disabled={true}
                  />
                </DivBoxColumn>

                <DivBoxColumn>
                  <label>
                    Idade 
                  </label>
                  <Input
                  type="text"
                  name="age"
                  value={age ? age + ' anos' : null}
                  placeholder="exemplo@email.com"
                  disabled={true}
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
                    disabled={true}
                  />
                </DivBoxColumn>

                <DivBoxColumn>
                  <label>Altura</label>
                  <InputMaskUnform
                    name="height"
                    mask="9.99"
                    type="text"
                    disabled={true}
                  />
                </DivBoxColumn>
              </DivBoxRow>
              <DivBoxColumn>
                <label>Atividades grupais de saúde</label>
                  <Input
                    type="text"
                    name="atividades"
                    placeholder="Dança, Passeios, Artesanato, Musculação"
                    disabled={true}
                  />
              </DivBoxColumn>

              <DivBoxRow>
                <DivBoxColumn>
                  <label>Naturalidade</label>
                  <Input
                    type="text"
                    name="naturalidade"
                    placeholder="Brasileira"
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
                  />
                </DivBoxColumn>
              </DivBoxRow>
            <DivBoxColumn>
              <label>*Doenças crônicas</label>
              <Input
                type="text"
                name="doencascronicas"
                placeholder="Hipertensão Arterial, Diabettes tipo 1, Diabetes tipo 2"
                disabled={true}
              />
              <label>
                *Nível de dependência para Atividades Básicas para Vida
              </label>
              <Input
                type="text"
                name="niveldependencia"
                placeholder="Escovar os dentes, Pentear os cabelos, Vestir-se, Tomar banho"
                disabled={true}
              />
            </DivBoxColumn>
            <DivBoxColumn>  
              <h2 style={{color:'#f79b39'}}>
                Comportamento anterior:
              </h2>
              <ReactSelect
                name="comportamentoanterior"
                value={'consumoalimentos'}
                options={[
                  { id: 'consumoalimentos', title: 'Alimentação/Nutrição: Consumo de alimentos ricos em açúcar e gordura.' },
                  { id: 'ingestahidrica', title: 'Alimentação/Nutrição: Ingesta hídrica reduzida.' },
                  { id: 'limitacosesfisicas', title: 'Prática Corporal/ Atividade física: Limitações físicas pela doença crônica.' },
                  { id: 'ausenciaatividade', title: 'Prática Corporal/ Atividade física: Ausência de atividade física.' },
                  { id: 'rendainsuficiente', title: 'Tratamento medicamentoso: Renda insuficiente para custeio com tratamento.' },
                  { id: 'dificuldadeaceitacao', title: 'Tratamento medicamentoso: Dificuldade de aceitação ao medicamento.' },
                  { id: 'usidetabaco', title: 'Uso de tabaco /outras drogas.' },
                ]}
                disabled={true}
              />
            </DivBoxColumn>
          </div>
          </DivBoxRow>          
          <div class="arrow"><div class="seta"></div></div>
          <DivBoxRow>
            <div className="content" style={{background:'#ecd9ff'}}>
              <h2>
                Conhecimentos Específicos do Comportamento
              </h2>
              <DivBoxColumn>
                <label>Benefícios percebidos no comportamento: Percebe benefícios quando executa o cuidado com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Sim - Prazer de viver"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Barreiras percebidas para a ação: O que a impede de realizar o cuidado com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Aderir/ Manter a alimentação"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Autoeficácia Percebida: Sente-se capaz de superar as barreiras e realizar o cuidado com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Sim"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Sentimentos presenciados ao realizar comportamento:</label>
                <Input
                  type="text"
                  name="name"
                  value={"Alegria"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Influências Interpessoais: O que influencia para que adote os cuidados com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Amigos"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Situações que influenciam: Quais locais que encontra informações e orientações de saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Programas de televisão"}
                  disabled={true}
                />
              </DivBoxColumn>
            </div>
          </DivBoxRow>
          <div class="arrow"><div class="seta"></div></div>
          <DivBoxRow>
            <div className="content" style={{background:'#ccffcc'}}>
              <h2>
                Resultado do comportamento
              </h2>
                <DivBoxRow>
                  <DivBoxColumn>
                    <label>Exigências imediatas - Baixo controle</label>
                    <Input
                      type="text"
                      name="name1"
                    />
                  </DivBoxColumn>
                  <DivBoxColumn>
                    <label>Exigências imediatas - Baixo controle</label>
                    <Input
                      type="email"
                      name="email2"
                    />
                  </DivBoxColumn>
                </DivBoxRow>
                <DivBoxColumn>
                  <label>Compromisso com o plano de ação:</label>
                  <Input
                    type="text"
                    name="name3"
                  />
                </DivBoxColumn>
                <DivBoxColumn>
                  <label>Comportamento promotor de saúde:</label>
                  <Input
                    type="text"
                    name="name4"
                  />
                </DivBoxColumn>
            </div>
          </DivBoxRow>
        </Form>
      </Container>
    </>
  );
}

ShowResult.propTypes = {
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
