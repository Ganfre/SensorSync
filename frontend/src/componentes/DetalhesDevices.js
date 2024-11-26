import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import styled, { keyframes, css } from 'styled-components';
import Graph from "./Graficos";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTable, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import FilterComponent from "./Filtro";

const Titulo = styled.div`
    h1 {
        font-weight: bold;
        color: #111827;
        padding: 0rem 1rem 1rem 0rem;
    }
`;

const Icones = styled.div`
   display: flex;
   align-items: center;
   
`;

const AdmContainer = styled.div`
    padding-left: 8rem;
    padding-right: 3rem;
    padding-bottom: 2rem;
`;

const BackButton = styled.button`
    background-color: transparent;
    color: #111827;
    border: none;
    padding: 5px 0px 0px 0px;
    cursor: pointer;
    font-size: 25px;
`;

const Legenda = styled.button`
    background-color: transparent;
    color: gray;
    border: none;
    padding: 5px 0px 0px 0px;
    cursor: pointer;
    font-size: 25px;
`;

const LinhaTitulo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const Popup = styled.div`
    position: absolute;
    top: 83px;
    right: 20px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: ${props => (props.show ? 'block' : 'none')};
`;

const CustomTable = styled(Table)`
    &.table {
        background-color: #444;
        color: #111827;
    }
    thead {
        background-color: #555;
    }
    tbody {
        tr {
            &:nth-child(even) {
                background-color: #444;
            }
            &:nth-child(odd) {
                background-color: #333;
            }
            td {
                color: #111827;
            }
        }
    }
`;

const pulsar = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
`;

const FogoIcon = styled(FontAwesomeIcon)`
    font-size: ${props => (props.fumaca > 40 ? '30px' : '27px')};
    padding-top: 3px;
    padding-right: 1.5rem;
    color: ${props => (props.fumaca > 40 ? 'red' : 'lightgray')};
    animation: ${props => props.fumaca > 40 ? css`${pulsar} 1s infinite` : 'none'};
`;

const DetalhesDevice = () => {
    const { id } = useParams();
    const { data } = useApi(`/devices/detalhes/${id}`);
    const medidas = data?.data?.message?.medidas || [];
    const [filtroData, setFiltroData] = useState({
        dataInicio: null,
        dataFim: null
    });
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const today = new Date();
        const dataInicio = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const dataFim = dataInicio; // O final do dia também é o mesmo dia para filtrar um único dia

        setFiltroData({ dataInicio, dataFim });
    }, []);

    const ultimasCincoMedidas = medidas.slice(-5);
    const fumaca = ultimasCincoMedidas.length > 0 ? ultimasCincoMedidas[ultimasCincoMedidas.length - 1].fumaca : 0;

    const exportToCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            medidas.map(row => Object.values(row).join(";")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "todas_medidas.csv");
        document.body.appendChild(link);
        link.click();
    };

    const goBack = () => {
        window.history.back();
    };

    const filtrarPorData = (medidasFiltradas, dataInicio, dataFim) => {
        const dataInicioFiltro = new Date(dataInicio);
        const dataFimFiltro = new Date(dataFim);
        dataFimFiltro.setDate(dataFimFiltro.getDate() + 1);

        return medidasFiltradas.filter(medida => {
            const dataMedida = new Date(medida.data.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2-$1-$3'));
            return dataMedida >= dataInicioFiltro && dataMedida < dataFimFiltro;
        });
    };

    return (
        <AdmContainer>
            <Container>
                <Row>
                    <Col md={12}>
                        <BackButton onClick={goBack}><FontAwesomeIcon icon={faArrowLeft} /></BackButton>
                    </Col>
                </Row>
                <LinhaTitulo>
                    <Titulo><h1>{data?.data?.message?.nome}</h1></Titulo>
                    <Icones>
                        <FogoIcon icon={faExclamationTriangle} fumaca={fumaca} />
                        <Legenda 
                            onMouseEnter={() => setShowPopup(true)}
                            onMouseLeave={() => setShowPopup(false)}
                        >
                            <FontAwesomeIcon icon={faTable} style={{ marginRight: '10px' }} />
                            <Popup show={showPopup}>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th colSpan="2">
                                                <h4 style={{ color: 'black', fontWeight: 'bold' }}>Parâmetros</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '16px' }}>
                                        <tr>
                                            <th>Temperatura</th>
                                            <td>20°C - 24°C</td>
                                        </tr>
                                        <tr>
                                            <th>Luminosidade</th>
                                            <td>7000 lm</td>
                                        </tr>
                                        <tr>
                                            <th>Umidade</th>
                                            <td>Méd. 50%</td>
                                        </tr>
                                        <tr>
                                            <th>Fumaça</th>
                                            <td>Méd. 15%</td>
                                        </tr>
                                        <tr>
                                            <th>Ruído</th>
                                            <td>Méd. 70%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Popup>
                        </Legenda>
                    </Icones>
               </LinhaTitulo>
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header>Últimas Medidas</Card.Header>
                            <Card.Body>
                                <CustomTable striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Temperatura</th>
                                            <th>Luminosidade</th>
                                            <th>Umidade</th>
                                            <th>Fumaça</th>
                                            <th>Ruído</th>
                                            <th>Presença</th>
                                            <th>Data</th>
                                            <th>Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ultimasCincoMedidas.map(med => (
                                            <tr key={med.data + med.hora}>
                                                <td style={med.temperatura < 20 ? { color: "red", fontWeight: 'bold' } : { color: "black" }}>{med.temperatura}°C</td>
                                                <td style={med.luminosidade > 7000 ? { color: "red", fontWeight: 'bold' } : { color: "black" }}>{med.luminosidade} lm</td>
                                                <td style={med.umidade > 90 ? { color: "red", fontWeight: 'bold' } : { color: "black" }}>{med.umidade}%</td>
                                                <td style={med.fumaca > 40 ? { color: "red", fontWeight: 'bold' } : { color: "black" }}>{med.fumaca}%</td>
                                                <td style={med.ruido > 75 ? { color: "red", fontWeight: 'bold' } : { color: "black" }}>{med.ruido} dB</td>
                                                <td style={med.presenca > 75 ? { color: "black", fontWeight: 'bold' } : { color: "black" }}>{med.presenca}</td>
                                                <td>{med.data}</td>
                                                <td>{med.hora}h</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </CustomTable>
                                <Button variant="primary" onClick={exportToCsv}>Exportar CSV</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header>Gráficos</Card.Header>
                            <Card.Body>
                                <FilterComponent 
                                    setFiltroData={setFiltroData} 
                                    dataInicio={filtroData.dataInicio} 
                                    dataFim={filtroData.dataFim}
                                />
                                <Row>
                                    <Col md={6}>
                                        <Graph data={filtrarPorData(medidas, filtroData?.dataInicio, filtroData?.dataFim).map((med) => ({ data: med.data, value: med.temperatura }))} title="Temperatura (°C)" />
                                    </Col>
                                    <Col md={6}>
                                        <Graph data={filtrarPorData(medidas, filtroData?.dataInicio, filtroData?.dataFim).map((med) => ({ data: med.data, value: med.luminosidade }))} title="Luminosidade (lm)" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Graph data={filtrarPorData(medidas, filtroData?.dataInicio, filtroData?.dataFim).map((med) => ({ data: med.data, value: med.umidade }))} title="Umidade (%)" />
                                    </Col>
                                    <Col md={6}>
                                        <Graph data={filtrarPorData(medidas, filtroData?.dataInicio, filtroData?.dataFim).map((med) => ({ data: med.data, value: med.ruido }))} title="Ruído (dB)" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Graph data={filtrarPorData(medidas, filtroData?.dataInicio, filtroData?.dataFim).map((med) => ({ data: med.data, value: med.fumaca }))} title="Fumaça (%)" />
                                    </Col>
                                    <Col md={6}>
                                        <Graph data={filtrarPorData(medidas, filtroData?.dataInicio, filtroData?.dataFim).map((med) => ({ data: med.data, value: med.presenca }))} title="Presença" />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </AdmContainer>
    );
}

export default DetalhesDevice;
