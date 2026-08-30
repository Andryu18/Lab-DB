//Thresholds for step four processing
const DEVIATION_THRESHOLD_MS = 100;
const FIRST_DEVIATION_THRESHOLD_MS = 50;

function deviationOf(notice) {
  return notice.realTime - notice.scheduledTime;
}

//A broken chain leaves gaps
function toValidRegister(register) {
  if (!Array.isArray(register)) {
    return [];
  }
  return register.filter((notice) => {
    return notice !== null
      && typeof notice === 'object'
      && Number.isFinite(notice.scheduledTime)
      && Number.isFinite(notice.realTime);
  });
}

//Null when nothing was measured
function computeAverageLatency(register) {
  const notices = toValidRegister(register);
  if (notices.length === 0) {
    return null;
  }
  const totalLatency = notices.reduce((accumulated, notice) => {
    return accumulated + deviationOf(notice);
  }, 0);
  return totalLatency / notices.length;
}

//filter selects, map projects names
function listIdentifiersDeviatingAbove(register, thresholdMs) {
  return toValidRegister(register)
    .filter((notice) => deviationOf(notice) > thresholdMs)
    .map((notice) => notice.eventName);
}

//find stops at first match
function findFirstDeviationAbove(register, thresholdMs) {
  return toValidRegister(register).find((notice) => deviationOf(notice) > thresholdMs);
}

//Attended after a later alarm
function findFirstOutOfOrder(register) {
  let latestScheduledSoFar = -Infinity;

  return toValidRegister(register).find((notice) => {
    if (notice.scheduledTime < latestScheduledSoFar) {
      return true;
    }
    latestScheduledSoFar = notice.scheduledTime;
    return false;
  });
}

function describeNotice(notice) {
  return notice ? notice.eventName : 'ninguno';
}

function describeLatency(averageLatency) {
  return averageLatency === null ? 'sin datos' : `${averageLatency.toFixed(2)} ms`;
}

//Same output for every version
function printReport(title, register) {
  console.log(`\n=== Bitacora final: ${title} ===`);
  console.table(register);

  console.log(`Latencia promedio (reduce): ${describeLatency(computeAverageLatency(register))}`);

  const deviatingIdentifiers = listIdentifiersDeviatingAbove(register, DEVIATION_THRESHOLD_MS);
  console.log(
    `Avisos con desvio mayor a ${DEVIATION_THRESHOLD_MS} ms (filter + map):`,
    deviatingIdentifiers.length > 0 ? deviatingIdentifiers.join(', ') : 'ninguno'
  );

  const firstDeviation = findFirstDeviationAbove(register, FIRST_DEVIATION_THRESHOLD_MS);
  console.log(
    `Primer aviso con desvio mayor a ${FIRST_DEVIATION_THRESHOLD_MS} ms (find):`,
    describeNotice(firstDeviation)
  );

  const outOfOrder = findFirstOutOfOrder(register);
  console.log('Primer aviso atendido fuera de orden (find):', describeNotice(outOfOrder));
}

function printFailure(error) {
  console.error(`Error en la cadena de avisos: ${error.message}`);
}

module.exports = { printReport, printFailure };
