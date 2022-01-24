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


export default function Results({ history, location }) {
  const limit = 20;
  const timer = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectResultsToEdit, setSelectedResultsToEdit] = useState(null);

  const [titleOrder, setTitleOrder] = useState('asc');

  async function loadResults({
    page = 1,
    query = '',
    title = 'asc',
  } = {}) {
    const response = await api.get(
      `/results?page=${page}&limit=${limit}&q=${query}&title=${title}`
    );

    const {
      results: _results,
      page: _page,
      total: _total,
      last_page: _lastPage,
    } = response.data;

    setIsFirstPage(Number(page) === 1);
    setIsLastPage(Number(page) === _lastPage);

    setResults(_results);
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
    loadResults({ page: _page });
  }, []); // eslint-disable-line

  function handleQueryChange(event) {
    if (timer.current) clearTimeout(timer.current);

    const _query = event.target.value;
    setCurrentQuery(_query);

    timer.current = setTimeout(() => {
      loadResults({ query: _query });
    }, 600);
  }

  function handleBefore() {
    if (!isFirstPage) {
      const page = Number(currentPage) - 1;
      setCurrentPage(page);
      loadResults({
        page,
        query: currentQuery,
        title: titleOrder,
      });
    }
  }

  function handleNext() {
    if (!isLastPage) {
      const page = Number(currentPage) + 1;
      setCurrentPage(page);
      loadResults({
        page,
        query: currentQuery,
        title: titleOrder,
      });
    }
  }

  async function handleShowCreate() {
    setShowCreate(true);
  }

  function handleClose() {
    setShowCreate(false);
  }

  function createSucesResults(res) {
    const result = res.data;
    
    setCurrentQuery('');
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(total + 1 <= limit);
    setTotal(total + 1);
    setTitleOrder('');

    const oldResults = results;
    if (oldResults.length >= limit) {
      oldResults.pop();
    }

    // TODO: Melhorar a exibição do results adicionado
    setResults([...oldResults, result]);

    toast.success(`Resultso cadastrado com suceso! Título: ${result.title}`);
  }

  async function createResults(data) {
    return api.post('/results', data);
  }

  async function updateResults(id, data) {
    return await api.put(`/results/${id}`, data);
  }

  async function handleDeleteResults(results) {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Tem certeza que deseja excluir o resultso?\nEsta ação é irreversível!'
      )
    ) {
      try {
        const response = await api.delete(`/results/${results.id}`);
        if (response.data) {
          loadResults({ query: currentQuery });

          toast.success(
            `Resultso de título ${results.title} foi excluído com suceso!`
          );
        }
      } catch (error) {
        console.tron.log(error);
        toast.error(
          `Resultso não excluído: ${error.response.data.mesages[0].errors[0]}`
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
    loadResults({
      page: currentPage,
      query: currentQuery,
      title: tempTitleOrder,
    });
  }

  function handleShowModalEdit(results) {
    setSelectedResultsToEdit(results);
  }

  return (
    <>
      <Modal visible={selectResultsToEdit !== null}>
        {selectResultsToEdit ? (
          <Form
            title='Alterar Cadastro Comportamentos/Aspectos'
            oldResults={selectResultsToEdit}
            handleSave={_results => 
              updateResults(selectResultsToEdit.id, _results).then(res =>{
                setResults(
                  results.map(s => (s.id === res.data.id ? res.data : s))
                );
                setSelectedResultsToEdit(null);
                toast.success(`Aluno alterado com suceso! Nome: ${res.data.title}`);
              })}
            handleClose={() => setSelectedResultsToEdit(null)}
          />
        ) : null}
      </Modal>

      <Modal visible={showCreate}>
        <Form title='Cadastro de Resultados' handleClose={handleClose} handleSave={_results => 
          createResults(_results).then(createSucesResults).then(handleClose)}
        />
      </Modal>
      
      <Content>
        <Header>
          <h1>Resultados</h1>
          <DivBoxRow>
            <button type="button" onClick={handleShowCreate}>
              <MdAdd color="#fff" size={20} />
              Cadastrar
            </button>

            <label className="search" htmlFor="search">
              <MdSearch color="#444" size={16} />
              <input
                type="text"
                placeholder="Buscar resultso"
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
                        Resultados
                      </th>
                      <th width="120" />
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(s => (
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
                              handleDeleteResults(s);
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

Results.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      currentPage: PropTypes.string,
    }),
  }),
};

Results.defaultProps = {
  location: {},
};
