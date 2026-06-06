let montoGlobalSeleccionado = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Escuchas de cambios para actualizar datos en tiempo real
    document.getElementById('monto').addEventListener('input', calcularVariablesBase);
    document.getElementById('comision_pct').addEventListener('change', calcularVariablesBase);
    document.getElementById('tasa').addEventListener('change', calcularVariablesBase);
    document.getElementById('plazo').addEventListener('change', calcularVariablesBase);
    
    // Botones principales
    document.getElementById('btn-cotizar').addEventListener('click', (e) => {
        e.preventDefault(); // Evita cualquier recarga de página accidental
        procesarLineasCredito();
    });
    
    document.getElementById('btn-limpiar').addEventListener('click', restaurarTodo);

    // Configurar clics para las tarjetas de líneas (100%, 80%, 50%)
    const tarjetas = document.querySelectorAll('.line-card');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            tarjetas.forEach(t => t.classList.remove('selected-line'));
            this.classList.add('selected-line');
            
            const porcentaje = parseFloat(this.getAttribute('data-pct'));
            const totalOriginal = parseFloat(document.getElementById('total_financiar').value);
            
            montoGlobalSeleccionado = totalOriginal * porcentaje;
            generarEstructuraAmortizacion(montoGlobalSeleccionado);
        });
    });

    // Primera ejecución para colocar valores iniciales en pantalla
    calcularVariablesBase();
});

// Calcula Comisión con IVA, Total Financiar y Pago por mil base
function calcularVariablesBase() {
    const monto = parseFloat(document.getElementById('monto').value) || 0;
    const pctComision = parseFloat(document.getElementById('comision_pct').value) || 0;
    const tasaAnual = parseFloat(document.getElementById('tasa').value) / 100;
    const plazo = parseInt(document.getElementById('plazo').value);

    // Fórmula: (Monto * %comision) * 1.16 de IVA
    const comisionMonto = (monto * (pctComision / 100)) * 1.16;
    document.getElementById('out-comision-monto').innerText = `$${comisionMonto.toFixed(2)}`;

    const totalFinanciar = monto + comisionMonto;
    document.getElementById('total_financiar').value = totalFinanciar.toFixed(2);

    // Pago por cada $1,000 pesos (Sistema Francés)
    const tasaMensual = tasaAnual / 12;
    const factorAnualidad = (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);
    const pagoPorMil = 1000 * factorAnualidad;
    
    document.getElementById('out-pago-mil').innerText = `$${pagoPorMil.toFixed(2)}`;
}

function procesarLineasCredito() {
    calcularVariablesBase();
    const totalFinanciar = parseFloat(document.getElementById('total_financiar').value);

    if (totalFinanciar <= 0 || isNaN(totalFinanciar)) {
        alert("Por favor introduce valores numéricos válidos.");
        return;
    }

    const tasaAnual = parseFloat(document.getElementById('tasa').value) / 100;
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasaMensual = tasaAnual / 12;
    const factor = (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);

    // Actualizar montos de las 3 tarjetas de líneas
    const opciones = [
        { idMonto: 'l100-monto', idPago: 'l100-pago', factorPct: 1.0 },
        { idMonto: 'l80-monto',  idPago: 'l80-pago',  factorPct: 0.8 },
        { idMonto: 'l50-monto',  idPago: 'l50-pago',  factorPct: 0.5 }
    ];

    opciones.forEach(opc => {
        const montoLinea = totalFinanciar * opc.factorPct;
        const pagoEstimadoFijo = montoLinea * factor;
        const pagoEstimadoConIva = pagoEstimadoFijo + ((montoLinea * tasaMensual) * 0.16);

        document.getElementById(opc.idMonto).innerText = `$${montoLinea.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits:2})}`;
        document.getElementById(opc.idPago).innerText = `Pago mensual aprox: $${pagoEstimadoConIva.toFixed(2)}`;
    });

    // MUESTRA LA SECCIÓN DE LAS LÍNEAS
    const secLineas = document.getElementById('sec-lineas');
    secLineas.classList.remove('hidden');
    secLineas.style.display = 'block';

    // Para evitar que el usuario tenga que dar doble clic, marcamos la Línea 100% por defecto
    const tarjeta100 = document.getElementById('card-l100');
    document.querySelectorAll('.line-card').forEach(t => t.classList.remove('selected-line'));
    tarjeta100.classList.add('selected-line');
    
    // Ejecutar la tabla inmediatamente con el 100%
    montoGlobalSeleccionado = totalFinanciar;
    generarEstructuraAmortizacion(montoGlobalSeleccionado);

    // Scroll suave hacia abajo
    secLineas.scrollIntoView({ behavior: 'smooth' });
}

function generarEstructuraAmortizacion(montoFinalElegido) {
    const nombre = document.getElementById('nombre').value;
    const tasaAnual = parseFloat(document.getElementById('tasa').value) / 100;
    const plazo = parseInt(document.getElementById('plazo').value);
    const cat = document.getElementById('cat').value;
    const pctComision = parseFloat(document.getElementById('comision_pct').value) || 0;
    const montoBaseInput = parseFloat(document.getElementById('monto').value) || 0;
    
    // Llenar panel de información superior
    document.getElementById('rep-cliente').innerText = nombre;
    document.getElementById('rep-plazo').innerText = plazo;
    document.getElementById('rep-tasa').innerText = (tasaAnual * 100);
    document.getElementById('rep-monto').innerText = `$${montoBaseInput.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    document.getElementById('rep-comision').innerText = `$${((montoBaseInput * (pctComision/100)) * 1.16).toLocaleString('es-MX', {minimumFractionDigits:2})}`;
    document.getElementById('rep-total').innerText = `$${montoFinalElegido.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    document.getElementById('rep-cat').innerText = cat;
    
    const tasaMensual = tasaAnual / 12;
    const factorAnualidad = (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);
    document.getElementById('rep-pagomil').innerText = `$${(1000 * factorAnualidad).toFixed(2)}`;

    // Fecha fija o actualizable
    document.getElementById('rep-fecha').innerText = "4 de junio de 2026";

    const tablaBody = document.querySelector('#tabla-amortizacion tbody');
    tablaBody.innerHTML = '';

    const pagoFijoMensual = montoFinalElegido * factorAnualidad;
    let saldoCapital = montoFinalElegido;

    for (let i = 1; i <= plazo; i++) {
        const interesPeriodo = saldoCapital * tasaMensual;
        const ivaInteres = interesPeriodo * 0.16;
        
        let pagoA_Capital = pagoFijoMensual - interesPeriodo;
        let pagoTotalMensual = pagoFijoMensual + ivaInteres;

        // Ajuste fino para el último mes
        if (i === plazo || saldoCapital < pagoA_Capital) {
            pagoA_Capital = saldoCapital;
            pagoTotalMensual = pagoA_Capital + interesPeriodo + ivaInteres;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${i}</td>
            <td>$${saldoCapital.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>$${pagoA_Capital.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>$${interesPeriodo.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>$${pagoFijoMensual.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>$${ivaInteres.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td><strong>$${pagoTotalMensual.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
            <td class="td-prepago"></td>
        `;
        tablaBody.appendChild(fila);

        saldoCapital -= pagoA_Capital;
        if(saldoCapital <= 0) break;
    }

    // MUESTRA LA SECCIÓN DE LA TABLA
    const secTabla = document.getElementById('sec-tabla');
    secTabla.classList.remove('hidden');
    secTabla.style.display = 'block';
}

function restaurarTodo() {
    document.getElementById('credit-form').reset();
    
    const secLineas = document.getElementById('sec-lineas');
    const secTabla = document.getElementById('sec-tabla');
    
    secLineas.classList.add('hidden');
    secLineas.style.display = 'none';
    secTabla.classList.add('hidden');
    secTabla.style.display = 'none';
    
    document.querySelectorAll('.line-card').forEach(c => c.classList.remove('selected-line'));
    calcularVariablesBase();
}