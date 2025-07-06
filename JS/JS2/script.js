const saida = document.getElementById("saidaJogo");

function adicionarTexto(mensagem, classe = '') {
    const span = document.createElement('span');
    span.textContent = mensagem + '\n';
    if (classe) {
        span.className = classe;
    }
    saida.appendChild(span);
    saida.scrollTop = saida.scrollHeight;
}

function jogarJokenpo() {
    let pontuacao = 0;
    const opcoes = ["Papel", "Pedra", "Tesoura"];

    adicionarTexto("Início do Jogo!");

    while (true) {
        let escolhaJogador;
        let entradaValida = false;

        while (!entradaValida) {
            const entrada = prompt(
                "Escolha sua jogada:\n" +
                "1 Papel\n" +
                "2 Pedra\n" +
                "3 Tesoura\n" +
                "(Digite o número correspondente)"
            );

            escolhaJogador = parseInt(entrada);

            if (escolhaJogador >= 1 && escolhaJogador <= 3) {
                entradaValida = true;
            } else {
                adicionarTexto(`Opção inválida (${entrada}). Você perdeu a rodada.`, 'resultado-derrota');
                adicionarTexto(`Você perdeu! Sua pontuação foi ${pontuacao}`, 'resultado-derrota');
                return;
            }
        }

        const escolhaComputador = Math.floor(Math.random() * 3) + 1;
        const textoComputador = opcoes[escolhaComputador - 1];

        adicionarTexto(`O computador jogou ${textoComputador}`);

        if (escolhaJogador === escolhaComputador) {
            adicionarTexto("A rodada empatou!", 'resultado-empate');
        } else if (
            (escolhaJogador === 1 && escolhaComputador === 2) ||
            (escolhaJogador === 2 && escolhaComputador === 3) ||
            (escolhaJogador === 3 && escolhaComputador === 1)
        ) {
            pontuacao++;
            adicionarTexto("Você ganhou!", 'resultado-vitoria');
            adicionarTexto(`Pontuação atual: ${pontuacao}`);
        } else {
            adicionarTexto("Você perdeu!", 'resultado-derrota');
            adicionarTexto(`Você perdeu! Sua pontuação foi ${pontuacao}`, 'resultado-derrota');
            return;
        }
    }
}

jogarJokenpo();
