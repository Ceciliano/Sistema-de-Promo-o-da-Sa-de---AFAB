import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import Notifications from '~/components/Notifications';
import { signOut } from '~/store/modules/auth/actions';

import { Container, Content, ButtonBox } from './styles';

import logo from '~/assets/logo/logo@1x.png';

export default function Header() {
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <Link to="/dashboard">
            <span className="logo">
              <img src={logo} alt="" />
            </span>
            <span className="logoText">Sistema de Promoção da Saúde - AFAB</span>
          </Link>
          <NavLink to="/students">Idosas</NavLink>
          <NavLink to="/plans">Comportamentos e Aspectos</NavLink>
          <NavLink to="/registrations">Resultados</NavLink>
        </nav>

        <aside>
          <ButtonBox>
            <button type="button" onClick={handleSignOut}>
              Sair
            </button>
          </ButtonBox>
        </aside>
      </Content>
    </Container>
  );
}
