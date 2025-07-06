class ConjuntoDeInteiros {
    #conjunto;
    #tamanhoMaximo;

    constructor(tamanhoMaximo) {
        if (typeof tamanhoMaximo !== 'number' || tamanhoMaximo < 0 || !Number.isInteger(tamanhoMaximo)) {
            throw new Error("O tamanho máximo deve ser um número inteiro não negativo.");
        }
        this.#tamanhoMaximo = tamanhoMaximo;
        this.#conjunto = new Array(tamanhoMaximo).fill(false);
    }

    inserir(valor) {
        if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0 || valor >= this.#tamanhoMaximo) {
            console.warn(`Valor ${valor} está fora do intervalo permitido [0, ${this.#tamanhoMaximo - 1}] ou não é um inteiro.`);
            return false;
        }
        if (!this.#conjunto[valor]) {
            this.#conjunto[valor] = true;
            return true;
        }
        return false;
    }

    remover(valor) {
        if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0 || valor >= this.#tamanhoMaximo) {
            console.warn(`Valor ${valor} está fora do intervalo permitido [0, ${this.#tamanhoMaximo - 1}] ou não é um inteiro.`);
            return false;
        }
        if (this.#conjunto[valor]) {
            this.#conjunto[valor] = false;
            return true;
        }
        return false;
    }

    uniao(outroConjunto) {
        if (!(outroConjunto instanceof ConjuntoDeInteiros) || outroConjunto.tamanhoMaximo !== this.#tamanhoMaximo) {
            throw new Error("Não é possível fazer a união com um conjunto incompatível.");
        }
        const resultado = new ConjuntoDeInteiros(this.#tamanhoMaximo);
        for (let i = 0; i < this.#tamanhoMaximo; i++) {
            if (this.#conjunto[i] || outroConjunto.conjunto[i]) {
                resultado.conjunto[i] = true;
            }
        }
        return resultado;
    }

    intersecao(outroConjunto) {
        if (!(outroConjunto instanceof ConjuntoDeInteiros) || outroConjunto.tamanhoMaximo !== this.#tamanhoMaximo) {
            throw new Error("Não é possível fazer a interseção com um conjunto incompatível.");
        }
        const resultado = new ConjuntoDeInteiros(this.#tamanhoMaximo);
        for (let i = 0; i < this.#tamanhoMaximo; i++) {
            if (this.#conjunto[i] && outroConjunto.conjunto[i]) {
                resultado.conjunto[i] = true;
            }
        }
        return resultado;
    }

    diferenca(outroConjunto) {
        if (!(outroConjunto instanceof ConjuntoDeInteiros) || outroConjunto.tamanhoMaximo !== this.#tamanhoMaximo) {
            throw new Error("Não é possível fazer a diferença com um conjunto incompatível.");
        }
        const resultado = new ConjuntoDeInteiros(this.#tamanhoMaximo);
        for (let i = 0; i < this.#tamanhoMaximo; i++) {
            if (this.#conjunto[i] && !outroConjunto.conjunto[i]) {
                resultado.conjunto[i] = true;
            }
        }
        return resultado;
    }

    toString() {
        const elementos = [];
        for (let i = 0; i < this.#tamanhoMaximo; i++) {
            if (this.#conjunto[i]) {
                elementos.push(i);
            }
        }
        return `{${elementos.join(', ')}}`;
    }

    ehIgual(outroConjunto) {
        if (!(outroConjunto instanceof ConjuntoDeInteiros) || outroConjunto.tamanhoMaximo !== this.#tamanhoMaximo) {
            return false;
        }
        for (let i = 0; i < this.#tamanhoMaximo; i++) {
            if (this.#conjunto[i] !== outroConjunto.conjunto[i]) {
                return false;
            }
        }
        return true;
    }

    contem(valor) {
        if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0 || valor >= this.#tamanhoMaximo) {
            return false;
        }
        return this.#conjunto[valor];
    }
}
