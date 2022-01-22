import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px;
  margin: 0 auto;

  > div + div {
    margin-top: 30px;
  }
`;
