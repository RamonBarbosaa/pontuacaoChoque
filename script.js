// Função para salvar os dados no armazenamento local
function salvarDados(nomePolicial, pontuacaoDiaria) {
    let dados = localStorage.getItem('dadosPolicias');
    if (!dados) {
        dados = {};
    } else {
        dados = JSON.parse(dados);
    }
    
    // Converter pontuacaoDiaria para número
    pontuacaoDiaria = Number(pontuacaoDiaria);

    if (dados.hasOwnProperty(nomePolicial)) {
        // Se o policial já tiver uma pontuação registrada, somar a pontuação diária à pontuação total
        dados[nomePolicial] += pontuacaoDiaria;
    } else {
        // Se o policial não tiver pontuação registrada, atribuir a pontuação diária como sua pontuação total
        dados[nomePolicial] = pontuacaoDiaria;
    }

    localStorage.setItem('dadosPolicias', JSON.stringify(dados));
}

// Função para atualizar a pontuação diária
function atualizarPontuacao() {
    const nomePolicial = document.getElementById('nomePolicial').value;
    const metricaSelecionada = document.getElementById('metrica').value;

    const metricas = {
        "apreensao_arma": 3,
        "cumprimento_mandado": 2,
        // Adicione outras métricas aqui
    };

    if (metricaSelecionada in metricas) {
        const pontuacao = metricas[metricaSelecionada];

        // Converter pontuacaoDiaria para número
        let pontuacaoDiaria = Number(pontuacao);

        // Atualizar o elemento HTML com a pontuação correta
        const pontuacaoDiariaElement = document.getElementById('pontuacaoDiaria');
        pontuacaoDiariaElement.innerText = `Pontuação Diária de ${nomePolicial}: ${pontuacaoDiaria}`;
        
        // Atualizar tabela de pontuação total dos policiais
        atualizarTabelaPontuacao(nomePolicial, pontuacaoDiaria);
        
        // Salvar os dados no armazenamento local
        salvarDados(nomePolicial, pontuacaoDiaria);
    } else {
        alert('Métrica inválida.');
    }
}

// Função para atualizar a tabela de pontuação total dos policiais
function atualizarTabelaPontuacao(nomePolicial, pontuacaoDiaria) {
    const corpoTabela = document.getElementById('corpoTabela');
    let policialEncontrado = false;

    // Verificar se o policial já está na tabela
    for (let i = 0; i < corpoTabela.rows.length; i++) {
        const row = corpoTabela.rows[i];
        if (row.cells[0].innerText === nomePolicial) {
            let pontuacaoTotal = Number(row.cells[1].innerText);
            // Somar a pontuação diária à pontuação total
            pontuacaoTotal += pontuacaoDiaria;
            row.cells[1].innerText = pontuacaoTotal;
            policialEncontrado = true;
            break;
        }
    }

    // Se o policial não estiver na tabela, adicioná-lo com a pontuação diária como sua pontuação total
    if (!policialEncontrado) {
        const newRow = corpoTabela.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        cell1.innerText = nomePolicial;
        cell2.innerText = pontuacaoDiaria;
    }

    // Ordenar a tabela com base na pontuação total (decrescente), incluindo o cabeçalho
    const rowsArray = Array.from(corpoTabela.rows); // Incluir o cabeçalho
    rowsArray.sort((rowA, rowB) => {
        const pontuacaoA = Number(rowA.cells[1].innerText);
        const pontuacaoB = Number(rowB.cells[1].innerText);
        return pontuacaoB - pontuacaoA;
    });
    // Remover todas as linhas da tabela
    while (corpoTabela.rows.length > 0) {
        corpoTabela.deleteRow(0);
    }
    // Adicionar as linhas ordenadas de volta à tabela
    rowsArray.forEach(row => corpoTabela.appendChild(row));
}


