/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signInRequest } from '~/store/modules/auth/actions';

import logo from '~/assets/logo/logo@1x.png';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function SignIn() {
  const dispatch = useDispatch();

  const loading = useSelector(state => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <span className="logo">Sistema de Promoção da Saúde AFAB</span>
      <Form schema={schema} onSubmit={handleSubmit}>
        <label htmlFor="email">Seu e-mail</label>
        <Input type="email" name="email" placeholder="Email" value="admin@gympoint.com" />

        <label htmlFor="password">Sua senha</label>
        <Input type="password" name="password" placeholder="Senha" value="123456"/>

        <button type="submit">
          {loading ? 'Carregando...' : 'Entrar no sistema'}
        </button>
      </Form>
    </>
  );
}
