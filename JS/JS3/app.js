console.log("--- Testando a Classe ConjuntoDeInteiros ---");

const conjuntoA = new ConjuntoDeInteiros(10);
console.log(`Conjunto A (inicial): ${conjuntoA.toString()}`);

conjuntoA.inserir(1);
conjuntoA.inserir(3);
conjuntoA.inserir(5);
conjuntoA.inserir(3);
conjuntoA.inserir(9);
conjuntoA.inserir(0);
console.log(`Conjunto A após inserções: ${conjuntoA.toString()}`);

conjuntoA.inserir(10);
conjuntoA.inserir(-1);
console.log(`Conjunto A após inserções inválidas: ${conjuntoA.toString()}`);

conjuntoA.remover(5);
console.log(`Conjunto A após remover 5: ${conjuntoA.toString()}`);
conjuntoA.remover(100);
console.log(`Conjunto A após remover não existente: ${conjuntoA.toString()}`);

const conjuntoB = new ConjuntoDeInteiros(10);
conjuntoB.inserir(0);
conjuntoB.inserir(2);
conjuntoB.inserir(4);
conjuntoB.inserir(6);
conjuntoB.inserir(8);
console.log(`Conjunto B: ${conjuntoB.toString()}`);

const uniao = conjuntoA.uniao(conjuntoB);
console.log(`União de A e B: ${uniao.toString()}`);

const intersecao = conjuntoA.intersecao(conjuntoB);
console.log(`Interseção de A e B: ${intersecao.toString()}`);

const diferencaAB = conjuntoA.diferenca(conjuntoB);
console.log(`Diferença A - B: ${diferencaAB.toString()}`);

const diferencaBA = conjuntoB.diferenca(conjuntoA);
console.log(`Diferença B - A: ${diferencaBA.toString()}`);

console.log(`O conjunto A contém 1? ${conjuntoA.contem(1)}`);
console.log(`O conjunto A contém 5? ${conjuntoA.contem(5)}`);
console.log(`O conjunto A contém 10? ${conjuntoA.contem(10)}`);

const conjuntoC = new ConjuntoDeInteiros(10);
conjuntoC.inserir(1);
conjuntoC.inserir(3);
conjuntoC.inserir(9);
conjuntoC.inserir(0);
console.log(`Conjunto C: ${conjuntoC.toString()}`);

console.log(`Conjunto A é igual ao Conjunto C? ${conjuntoA.ehIgual(conjuntoC)}`);
console.log(`Conjunto A é igual ao Conjunto B? ${conjuntoA.ehIgual(conjuntoB)}`);

const conjuntoVazio = new ConjuntoDeInteiros(5);
console.log(`Conjunto vazio: ${conjuntoVazio.toString()}`);
conjuntoVazio.inserir(2);
console.log(`Conjunto vazio após inserir 2: ${conjuntoVazio.toString()}`);
conjuntoVazio.remover(2);
console.log(`Conjunto vazio após remover 2: ${conjuntoVazio.toString()}`);

const conjuntoD = new ConjuntoDeInteiros(5);
conjuntoD.inserir(1);
conjuntoD.inserir(2);
console.log(`Conjunto D: ${conjuntoD.toString()}`);

try {
    conjuntoA.uniao(conjuntoD);
} catch (erro) {
    console.error(`Erro durante união (esperado): ${erro.message}`);
}
