import React from 'react';
import styled from 'styled-components';
import Logo_Colorido from './img/Logo_Colorido.png'

const Inicio = styled.div`
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10rem;
    color: black;
`;

const Descricao = styled.div`
    flex: 1;
    padding-right: 5rem;
    h1{
        font-weight: bold;
        font-size: 3rem;
        color: black;
    }
    h2{
        padding-top: 1rem;
        font-weight: bold;
        font-size: 2rem;
        color: black;
    }
    p{
        padding-top: 1rem;
        font-size: 20px;
        text-align: justify;
        color: black;
    }
`;

const SecaoResumo = ()=>{
    return(
        <Inicio>
            <Descricao>
                <img style={{ width: '65%', height: 'auto'}} src={Logo_Colorido} alt="Logo_Colorido" />
                <h2>Automação Industrial</h2>
                <p>
                    A nossa plataforma de eficiência energética foi desenvolvida para monitorar e otimizar o consumo de
                    energia em diversos ambientes, como salas de aula, escritórios, e outros espaços comerciais e residenciais. 
                    Através de sensores que coletam dados em tempo real, podemos entender o consumo de energia e agir para 
                    otimizar o uso, promovendo um ambiente mais eficiente e sustentável.
                </p>
            </Descricao>
        </Inicio>
    )
}

export default SecaoResumo