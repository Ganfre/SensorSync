import { sendMail } from '../servicos/api';

let projetosComEmailEnviado = JSON.parse(localStorage.getItem('projetosComEmailEnviado')) || {};

export function enviarEmailAlerta(projeto) {
    const limiteTemperatura = 85;
    const limiteUmidade = 10;
    const limiteLuminosidade = 15;
    const limiteFumaca = 800;
    const limiteRuido = 800;


    if (projeto.medidas && projeto.medidas.length > 0) {
        const ultimaMedida = projeto.medidas[projeto.medidas.length - 1];

        if (!projetosComEmailEnviado[projeto.nome] &&
            (ultimaMedida.temperatura > limiteTemperatura ||
             ultimaMedida.umidade > limiteUmidade ||
             ultimaMedida.luminosidade > limiteLuminosidade ||
             ultimaMedida.fumaca < limiteFumaca ||
             ultimaMedida.ruido < limiteRuido)) {
            const emailData = {
                email: 'sensorsync.ptg@gmail.com',
                nome: 'SensoSync',
                mensagem: `!!!ATENÇÃO!!! 
O device ${projeto.nome} apresentou valores fora da faixa indicada. Por favor, investigue o que pode estar causando esse comportamento.`
            };
            sendMail(emailData);
            
            projetosComEmailEnviado[projeto.nome] = true;
            localStorage.setItem('projetosComEmailEnviado', JSON.stringify(projetosComEmailEnviado));
        } else if (ultimaMedida.temperatura <= limiteTemperatura &&
                   ultimaMedida.umidade <= limiteUmidade &&
                   ultimaMedida.luminosidade <= limiteLuminosidade &&
                   ultimaMedida.fumaca >= limiteFumaca &&
                   ultimaMedida.ruido >= limiteRuido) {
            delete projetosComEmailEnviado[projeto.nome];
            localStorage.setItem('projetosComEmailEnviado', JSON.stringify(projetosComEmailEnviado));
        }
    }
}
