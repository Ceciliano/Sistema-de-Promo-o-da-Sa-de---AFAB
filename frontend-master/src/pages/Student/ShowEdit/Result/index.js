/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input } from '@rocketseat/unform';
import { parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import InputMaskUnform from '~/components/InputMaskUnform';
import ReactSelect from '~/components/ReactSelect';
import api from '~/services/api';
import { Container, DivBoxColumn, DivBoxRow } from '../styles';


const schema = Yup.object().shape({
  acaoImediataBaixoControle: Yup.string(),
  compromisso: Yup.string(),
  comportamento: Yup.string(),
  acaoImediataAltoControle: Yup.string(),
});

export default function ShowResult({ history, location }) {
  const [student, setStudent] = useState({
    ...location.state.student,
    birthday: parseISO(location.state.student.birthday),
  });

  const [age, ] = useState(student.age);

  function handleGoBack() {
    history.push('/students', { currentPage: location.state.currentPage });
  }

  async function handleSubmit({ 
    acaoImediataBaixoControle,
    compromisso,
    comportamento,
    acaoImediataAltoControle,
   }) {

    try {
      const response = await api.put(`/students/consults/${student.id}`, {
        acaoImediataBaixoControle,
        compromisso,
        comportamento,
        acaoImediataAltoControle,
      });

      setStudent(response.data);
      toast.success(`Idosa alterada com sucesso! Nome: ${student.name}`);
    } catch (error) {
      console.tron.error(error);
      toast.error('Erro ao editar o Idosa.');
    }
  }

  return (
    <>
      <Container>
        <Form
          schema={schema}
          initialData={student}
          onSubmit={handleSubmit}
          context={{ age }}
        >
          <header>
            <h1>Resultado</h1>
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
                *Desenvolve Atividades Instrumentais de Vida Diária (AIVD)
              </label>
              <Input
                type="text"
                name="niveldependencia"
                placeholder=""
                disabled={true}
              />
            </DivBoxColumn>
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
                disabled={true}
              />
            </DivBoxColumn>
          </div>
          </DivBoxRow>          
          <div className="arrow"><div className="seta"></div></div>
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
                  value={"Sim - Prazer de viver, Sim - Melhora disposição, Sim - sente-se saudável"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Barreiras percebidas para a ação: O que a impede de realizar o cuidado com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Aderir/ Manter a alimentação, Recurso financeiro, Falta de apoio da família"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Autoeficácia Percebida: Sente-se capaz de superar as barreiras e realizar o cuidado com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Não"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Sentimentos presenciados ao realizar comportamento:</label>
                <Input
                  type="text"
                  name="name"
                  value={"Alegria, Bem-estar"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Influências Interpessoais: O que influencia para que adote os cuidados com a saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Amigos, Filhos, ACS, medo de adoecer"}
                  disabled={true}
                />
              </DivBoxColumn>
              <DivBoxColumn>
                <label>Situações que influenciam: Quais locais que encontra informações e orientações de saúde?</label>
                <Input
                  type="text"
                  name="name"
                  value={"Programas de televisão, Grupos/palestras na ESF, Academia Carioca"}
                  disabled={true}
                />
              </DivBoxColumn>
            </div>
          </DivBoxRow>
          <div className="arrow"><div className="seta"></div></div>
          <DivBoxRow>
            <div className="content" style={{background:'#ccffcc'}}>
              <h2>
                Resultado do comportamento
              </h2>
                <DivBoxRow>
                  <DivBoxColumn>
                    <label>Ações imediatas de Baixo controle</label>
                    <Input
                      type="text"
                      name="acaoImediataBaixoControle"
                    />
                  </DivBoxColumn>
                  <DivBoxColumn>
                    <label>Ações imediatas de Alto controle (preferenciais)</label>
                    <Input
                      type="text"
                      name="acaoImediataAltoControle"
                    />
                  </DivBoxColumn>
                </DivBoxRow>
                <DivBoxColumn>
                  <label>Compromisso com o plano de ação:</label>
                  <Input
                    type="text"
                    name="compromisso"
                  />
                </DivBoxColumn>
                <DivBoxColumn>
                  <label>Comportamento promotor de saúde:</label>
                  <Input
                    type="text"
                    name="comportamento"
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
