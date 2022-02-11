import React from 'react';
import { DivStartRow, Header } from '~/styles/styles';
import { Container } from './styles';
import logo from '~/assets/logo/logo@1x.png';

export default function Dashboard() {
  return (
    <Container>
      <Header>
          <DivStartRow>
            <h1>Bem-vindo ao Sistema de Promoção da Saúde - AFAB!</h1>
          </DivStartRow>
      </Header>
    </Container>
  );
}
