import React from 'react';
import { DivStartRow, Header, DivBoxColumn } from '~/styles/styles';
import { Container } from './styles';
import logo from '~/assets/logo/grafico.png';

export default function Dashboard() {
  return (
    <Container>
      <Header>
          <DivBoxColumn>
            <DivStartRow>
              <h1>Bem-vindo ao Sistema de Promoção da Saúde - AFAB!</h1>
            </DivStartRow>
              <img src={logo} alt="" style={{width: "100%",  padding: "10px 300px 0px 200px"}}/>
          </DivBoxColumn>
      </Header>
    </Container>
  );
}
