/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  MdAdd, MdArrowDownward,
  MdArrowUpward, MdKeyboardArrowLeft,
  MdKeyboardArrowRight, MdSearch
} from 'react-icons/md';
import { toast } from 'react-toastify';
import LoadingIndicator from '~/components/LoadingIndicator';
import Modal from '~/components/Modal';
import api from '~/services/api';
import {
  ButtonPagination, Content, DivBoxRow, EmptyTable, Header, Loading, TableBox
} from '~/styles/styles';
import Form from './Form';


export default function Plan({ history, location }) {
  const limit = 20;
  const timer = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [plans, setPlans] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectPlanToEdit, setSelectedPlanToEdit] = useState(null);

  const [titleOrder, setTitleOrder] = useState('asc');
  const [durationOrder, setDurationOrder] = useState('');
  const [priceOrder, setPriceOrder] = useState('');

  async function loadPlans({
    page = 1,
    query = '',
    title = 'asc',
  } = {}) {
    const response = await api.get(
      `/plans?page=${page}&limit=${limit}&q=${query}&title=${title}`
    );

    const {
      plans: _plans,
      page: _page,
      total: _total,
      last_page: _lastPage,
    } = response.data;

    setIsFirstPage(Number(page) === 1);
    setIsLastPage(Number(page) === _lastPage);

    setPlans(_plans);
    setTotal(_total);
    setCurrentPage(_page);
    setLoading(false);
  }

  useEffect(() => {
    let _page = 1;
    if (location.state && location.state.currentPage) {
      _page = Number(location.state.currentPage);
      setCurrentPage(_page);
    }
    setLoading(true);
    loadPlans({ page: _page });
  }, []); // eslint-disable-line

  function handleQueryChange(event) {
    if (timer.current) clearTimeout(timer.current);

    const _query = event.target.value;
    setCurrentQuery(_query);

    timer.current = setTimeout(() => {
      loadPlans({ query: _query });
    }, 600);
  }

  function handleBefore() {
    if (!isFirstPage) {
      const page = Number(currentPage) - 1;
      setCurrentPage(page);
      loadPlans({
        page,
        query: currentQuery,
        title: titleOrder,
        duration: durationOrder,
        price: priceOrder,
      });
    }
  }

  function handleNext() {
    if (!isLastPage) {
      const page = Number(currentPage) + 1;
      setCurrentPage(page);
      loadPlans({
        page,
        query: currentQuery,
        title: titleOrder,
        duration: durationOrder,
        price: priceOrder,
      });
    }
  }

  async function handleShowCreate() {
    setShowCreate(true);
  }

  function handleClose() {
    setShowCreate(false);
  }

  function createSucessPlan(res) {
    const plan = res.data;
    
    setCurrentQuery('');
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(total + 1 <= limit);
    setTotal(total + 1);
    setTitleOrder('');
    setDurationOrder('');
    setPriceOrder('');

    const oldPlans = plans;
    if (oldPlans.length >= limit) {
      oldPlans.pop();
    }

    // TODO: Melhorar a exibição do plan adicionado
    setPlans([...oldPlans, plan]);

    toast.success(`Plano cadastrado com sucesso! Título: ${plan.title}`);
  }

  async function createPlan(data) {
    return api.post('/plans', data);
  }

  async function updatePlan(id, data) {
    return await api.put(`/plans/${id}`, data);
  }

  async function handleDeletePlan(plan) {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Tem certeza que deseja excluir o plano?\nEsta ação é irreversível!'
      )
    ) {
      try {
        const response = await api.delete(`/plans/${plan.id}`);
        if (response.data) {
          loadPlans({ query: currentQuery });

          toast.success(
            `Plano de título ${plan.title} foi excluído com sucesso!`
          );
        }
      } catch (error) {
        console.tron.log(error);
        toast.error(
          `Plano não excluído: ${error.response.data.messages[0].errors[0]}`
        );
      }
    }
  }

  function handleSortOrder(field, order) {
    let tempTitleOrder = titleOrder;

    if (field === 'title') {
      if (order === tempTitleOrder) {
        setTitleOrder('');
        tempTitleOrder = '';
      } else if (order === 'asc') {
        setTitleOrder('asc');
        tempTitleOrder = 'asc';
      } else {
        setTitleOrder('desc');
        tempTitleOrder = 'desc';
      }
    }
    loadPlans({
      page: currentPage,
      query: currentQuery,
      title: tempTitleOrder,
    });
  }

  function handleShowModalEdit(plan) {
    setSelectedPlanToEdit(plan);
  }

  return (
    <>
      <Modal visible={selectPlanToEdit !== null}>
        {selectPlanToEdit ? (
          <Form
            title='Alterar Cadastro Comportamentos/Aspectos'
            oldPlan={selectPlanToEdit}
            handleSave={_plan => 
              updatePlan(selectPlanToEdit.id, _plan).then(res =>{
                setPlans(
                  plans.map(s => (s.id === res.data.id ? res.data : s))
                );
                setSelectedPlanToEdit(null);
                toast.success(`Aluno alterado com sucesso! Nome: ${res.data.title}`);
              })}
            handleClose={() => setSelectedPlanToEdit(null)}
          />
        ) : null}
      </Modal>

      <Modal visible={showCreate}>
        <Form title='Cadastro de Comportamentos/Aspectos' handleClose={handleClose} handleSave={_plan => 
          createPlan(_plan).then(createSucessPlan).then(handleClose)}
        />
      </Modal>
      
      <Content>
        <Header>
          <h1>Gerenciando Comportamentos/Aspectos</h1>
          <DivBoxRow>
            <button type="button" onClick={handleShowCreate}>
              <MdAdd color="#fff" size={20} />
              Cadastrar
            </button>

            <label className="search" htmlFor="search">
              <MdSearch color="#444" size={16} />
              <input
                type="text"
                placeholder="Buscar plano"
                onChange={handleQueryChange}
                disabled={loading ? 1 : 0}
              />
            </label>
          </DivBoxRow>
        </Header>

        {loading ? (
          <Loading>
            <LoadingIndicator size={40} />
          </Loading>
        ) : (
          <>
            {total ? (
              <TableBox>
                <div>
                  <p>
                    <span>Total de registros: {total}</span>
                    <span>Exibindo: {limit}</span>
                    <span>Página: {currentPage}</span>
                  </p>
                  <div className="pagination">
                    <ButtonPagination
                      disabled={isFirstPage ? 1 : 0}
                      type="button"
                      onClick={handleBefore}
                    >
                      <MdKeyboardArrowLeft color="#fff" size={20} />
                      Anterior
                    </ButtonPagination>
                    <ButtonPagination
                      disabled={isLastPage ? 1 : 0}
                      type="button"
                      onClick={handleNext}
                    >
                      Próximo
                      <MdKeyboardArrowRight color="#fff" size={20} />
                    </ButtonPagination>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th className="text-left">
                        <MdArrowUpward
                          color={titleOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('title', 'desc')}
                        />
                        <MdArrowDownward
                          color={titleOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('title', 'asc')}
                        />
                        PERGUNTA DO COMPORTAMENTOS/ASPECTOS
                      </th>
                      <th width="120" />
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(s => (
                      <tr key={s.id}>
                        <td>{s.title}</td>
                        <td className="text-center">
                          <button
                            className="neutral-button"
                            type="button"
                            onClick={() => {
                              handleShowModalEdit(s);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="delete-button"
                            type="button"
                            onClick={() => {
                              handleDeletePlan(s);
                            }}
                          >
                            Apagar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableBox>
            ) : (
              <EmptyTable>
                <p>Lista Vazia</p>
              </EmptyTable>
            )}
          </>
        )}
      </Content>
    </>
  );
}

Plan.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      currentPage: PropTypes.string,
    }),
  }),
};

Plan.defaultProps = {
  location: {},
};
