let grafico = null;

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function calcular(e) {
    e.preventDefault();

    let salario = parseFloat(document.getElementById("salario").value) || 0;
    let dependentes = parseInt(document.getElementById("dependentes").value) || 0;
    let descontos = parseFloat(document.getElementById("descontos").value) || 0;

    // 🔹 Desconto por dependentes
    let descontoDependente = dependentes * 189.59;

    // 🔹 Soma das deduções legais
    let totalDeducoes = descontoDependente + descontos;

    // 🔹 Desconto simplificado
    let descontoSimplificado = 607.20;

    // 🔹 Escolha da melhor dedução
    let deducaoUsada = Math.max(totalDeducoes, descontoSimplificado);

    let tipoDeducao = totalDeducoes > descontoSimplificado
        ? "Deduções legais (dependentes + descontos)"
        : "Desconto simplificado";

    // 🔹 Base de cálculo
    let base = salario - deducaoUsada;

    let aliquota = 0;
    let deducao = 0;

    if (base <= 2428.80) {
        aliquota = 0;
        deducao = 0;
    } else if (base <= 2826.65) {
        aliquota = 0.075;
        deducao = 182.16;
    } else if (base <= 3751.05) {
        aliquota = 0.15;
        deducao = 394.16;
    } else if (base <= 4664.68) {
        aliquota = 0.225;
        deducao = 675.49;
    } else {
        aliquota = 0.275;
        deducao = 908.73;
    }

    // 🔹 Cálculo do imposto
    let imposto = (base * aliquota) - deducao;
    if (imposto < 0) imposto = 0;

    // 🔹 SALÁRIO LÍQUIDO (CORRIGIDO)
    // Dependentes NÃO são descontados direto, apenas reduzem o imposto
    let salarioLiquido = salario - imposto - descontos;

    let aliquotaEfetiva = salario > 0 ? (imposto / salario) * 100 : 0;

    // ✅ RESULTADO
    document.getElementById("resultado").innerHTML = `
        <h2>Resultado</h2>
        <p><strong>Desconto por dependentes:</strong> ${formatarMoeda(descontoDependente)}</p>
        <p><strong>Outras deduções:</strong> ${formatarMoeda(descontos)}</p>
        <p><strong>Total de deduções:</strong> ${formatarMoeda(totalDeducoes)}</p>
        <p><strong>Tipo de dedução aplicada:</strong> ${tipoDeducao}</p>
        <p><strong>Dedução aplicada:</strong> ${formatarMoeda(deducaoUsada)}</p>
        <p><strong>Base de cálculo:</strong> ${formatarMoeda(base)}</p>
        <p><strong>Imposto:</strong> ${formatarMoeda(imposto)}</p>
        <p><strong>Salário Líquido:</strong> ${formatarMoeda(salarioLiquido)}</p>
        <p><strong>Alíquota nominal:</strong> ${(aliquota * 100).toFixed(2)}%</p>
        <p><strong>Alíquota efetiva:</strong> ${aliquotaEfetiva.toFixed(2)}%</p>
    `;

    // ✅ TABELA
    document.getElementById("tabela").style.display = "table";
    document.getElementById("dadosTabela").innerHTML = `
        <tr><td>Salário Bruto</td><td>${formatarMoeda(salario)}</td></tr>
        <tr><td>Desconto por Dependentes</td><td>${formatarMoeda(descontoDependente)}</td></tr>
        <tr><td>Outras Deduções</td><td>${formatarMoeda(descontos)}</td></tr>
        <tr><td>Total de Deduções</td><td>${formatarMoeda(totalDeducoes)}</td></tr>
        <tr><td>Desconto Simplificado</td><td>${formatarMoeda(descontoSimplificado)}</td></tr>
        <tr><td>Dedução Utilizada</td><td>${formatarMoeda(deducaoUsada)}</td></tr>
        <tr><td>Base de Cálculo</td><td>${formatarMoeda(base)}</td></tr>
        <tr><td>Imposto</td><td>${formatarMoeda(imposto)}</td></tr>
        <tr><td><strong>Salário Líquido</strong></td><td><strong>${formatarMoeda(salarioLiquido)}</strong></td></tr>
    `;

    // 🔄 Remove gráfico anterior
    if (grafico) {
        grafico.destroy();
    }

    // 📊 GRÁFICO PIZZA
    const ctx = document.getElementById("grafico").getContext("2d");

    grafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Salário Líquido', 'Imposto', 'Outros Descontos'],
            datasets: [{
                data: [salarioLiquido, imposto, descontos],
                backgroundColor: [
                    '#4CAF50',
                    '#F44336',
                    '#FF9800'
                ]
            }]
        },
        // options: {
        //     responsive: true,
        //     plugins: {
        //         legend: {
        //             position: 'bottom'
        //         }
        //     }
        // }
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}