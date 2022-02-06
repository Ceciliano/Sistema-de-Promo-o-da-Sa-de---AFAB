/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input} from '@rocketseat/unform';
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
  ),
  baixocontrole: Yup.string(),
  autocontrole: Yup.string(),
});

export default function ConsultForm({ name, student_id, handleSave, handleClose, oldConsults }) {
  const newConsults = { title: '', respostas:[{ title: '' }] }
  const [consults, ] = useState(oldConsults? oldConsults:newConsults);
  const [perguntas, setPerguntas] = useState([{title:'teste'}]);
  const [errorApi, setErrorApi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerguntas();
  }, []); // eslint-disable-line

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
  }, [errorApi]); // eslint-disable-line

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
      handleSave({...data, student_id: student_id});
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
            <h1>{name}</h1>
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
            {loading ? (
              <Loading>
                <LoadingIndicator size={40} />
              </Loading>
            ) : (
              <>
                 <h1>Conhecimentos específicos da conduta</h1>
                {perguntas.map(function(p, i){
                  return <DivBoxRow key={i} style={{padding: '5px 0'}}>
                    <DivBoxRow>
                      <DivBoxColumn>
                        {p.title}
                      </DivBoxColumn>
                      <DivBoxColumn>
                        <AssyncSelect
                          name={`respostas.${i}.id`}
                          promiseOptions={data=>handleComportamentosChange(data, p.id)}
                        />
                      </DivBoxColumn>
                    </DivBoxRow>
                  </DivBoxRow>
                })}
              </>
            )}
          </div>

          <div className="content" style={{padding: '0 30px 30px'}}>
            <hr />
            <h1>Exigências imediatas:</h1>
            <DivBoxRow>
              <DivBoxRow>
                <DivBoxColumn>
                  Baixo controle:
                </DivBoxColumn>
                <DivBoxColumn>
                  <Input
                    type="text"
                    name="baixocontrole"
                    placeholder="Dança, Passeios, Artesanato, Musculação"
                  />
                </DivBoxColumn>
              </DivBoxRow>
            </DivBoxRow>
            <DivBoxRow>
              <DivBoxRow>
                <DivBoxColumn>
                  Auto controle:
                </DivBoxColumn>
                <DivBoxColumn>
                  <Input
                    type="text"
                    name="autocontrole"
                    placeholder="Dança, Passeios, Artesanato, Musculação"
                  />
                </DivBoxColumn>
              </DivBoxRow>
            </DivBoxRow>
          </div>
        </Form>
      </ModalContent>
    </Container>
  );
}

ConsultForm.propTypes = {
  name: PropTypes.string,
  student_id: PropTypes.number,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  oldConsults: PropTypes.shape({
    title: PropTypes.string,
    respostas: PropTypes.array,
    baixocontrole: PropTypes.string,
    autocontrole: PropTypes.string,
  })
};
