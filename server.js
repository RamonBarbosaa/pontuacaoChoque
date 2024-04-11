const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configuração do banco de dados
const db = new sqlite3.Database('policiais.db');

// Criar tabela de policiais se não existir
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS policiais (id INTEGER PRIMARY KEY, nome TEXT, pontuacao INTEGER)");
});

// Rota para recuperar todos os policiais
app.get('/policiais', (req, res) => {
    db.all("SELECT * FROM policiais", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao recuperar policiais' });
        } else {
            res.json(rows);
        }
    });
});

// Rota para adicionar um novo policial
app.post('/policiais', (req, res) => {
    const { nome, pontuacao } = req.body;
    if (!nome || !pontuacao) {
        res.status(400).json({ error: 'Nome e pontuação são obrigatórios' });
        return;
    }
    db.run("INSERT INTO policiais (nome, pontuacao) VALUES (?, ?)", [nome, pontuacao], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao adicionar policial' });
        } else {
            res.status(201).json({ message: 'Policial adicionado com sucesso' });
        }
    });
});

// Rota para atualizar a pontuação de um policial
app.put('/policiais/:id', (req, res) => {
    const id = req.params.id;
    const { pontuacao } = req.body;
    if (!pontuacao) {
        res.status(400).json({ error: 'Pontuação é obrigatória' });
        return;
    }
    db.run("UPDATE policiais SET pontuacao = ? WHERE id = ?", [pontuacao, id], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao atualizar pontuação do policial' });
        } else {
            res.json({ message: 'Pontuação do policial atualizada com sucesso' });
        }
    });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor está rodando na porta ${port}`);
});
