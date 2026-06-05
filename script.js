document.getElementById('btn-calcular').addEventListener('click', procesarSimulacion);
function procesarSimulacion() {
const montoInput = parseFloat(document.getElementById('monto').value);
const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
const plazoMeses = parseInt(document.getElementById('plazo').value);
const IVA_VALOR = 0.16;
if (isNaN(montoInput) || isNaN(tasaAnualInput) || montoInput <= 0) {
alert("Ingrese parámetros numéricos válidos e intente nuevamente.");
return;

}
const amortizacionCapital = montoInput / plazoMeses;
const tasaMensualEquivalente = tasaAnualInput / 12;
let saldoInsodocument.getElementById('btn-calcular').addEventListener('click', procesarSimulacion);

function procesarSimulacion() {
    const montoInput = parseFloat(document.getElementById('monto').value);
    const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
    const plazoMeses = parseInt(document.getElementById('plazo').value);
    const IVA_VALOR = 0.16;

    // Validación básica de datos
    if (isNaN(montoInput) || isNaN(tasaAnualInput) || isNaN(plazoMeses) || montoInput <= 0 || tasaAnualInput < 0) {
        alert("Ingrese parámetros numéricos válidos e intente nuevamente.");
        return;
    }

    const amortizacionCapital = montoInput / plazoMeses;
    const tasaMensualEquivalente = tasaAnualInput / 12;
    let saldoInsoluto = montoInput;

    const tablaBody = document.querySelector('#tabla-amortizacion tbody');
    tablaBody.innerHTML = ''; // Limpiar simulaciones anteriores

    // Ciclo para calcular mes con mes
    for (let periodo = 1; periodo <= plazoMeses; periodo++) {
        const interesDelPeriodo = saldoInsoluto * tasaMensualEquivalente;
        const ivaSobreInteres = interesDelPeriodo * IVA_VALOR;
        const pagoMensualTotal = amortizacionCapital + interesDelPeriodo + ivaSobreInteres;

        // Crear fila para la tabla
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${periodo}</td>
            <td>$${saldoInsoluto.toFixed(2)}</td>
            <td>$${amortizacionCapital.toFixed(2)}</td>
            <td>$${interesDelPeriodo.toFixed(2)}</td>
            <td>$${ivaSobreInteres.toFixed(2)}</td>
            <td><strong>$${pagoMensualTotal.toFixed(2)}</strong></td>
        `;
        tablaBody.appendChild(fila);

        // IMPORTANTE: Restar el capital pagado para el siguiente mes
        saldoInsoluto -= amortizacionCapital;
    }
}luto = montoInput;
const tablaBody = document.querySelector('#tabla-amortizacion tbody');
tablaBody.innerHTML = '';
let acumuladoPagos = 0;
for (let periodo = 1; periodo <= plazoMeses; periodo++) {
const interesDelPeriodo = saldoInsoluto * tasaMensualEquivalente;
const ivaSobreInteres = interesDelPeriodo * IVA_VALOR;
const pagoMensualTotal = amortizacionCapital + interesDelPeriodo + ivaSobreInteres;
acumuladoPagos += pagoMensualTotal;