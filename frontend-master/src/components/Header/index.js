import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import logo from '~/assets/logo/logo@1x.png';
import { signOut } from '~/store/modules/auth/actions';
import { ButtonBox, Container, Content } from './styles';

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
          <NavLink to="/plans">Conhecimentos específicos</NavLink>
          <NavLink to="/results">Resultados</NavLink>
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
