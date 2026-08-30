const { EVENTS, createPromiseEvent } = require('./eventsData');
const { printReport, printFailure } = require('./analysis');

const referenceTime = Date.now();

const events = EVENTS.map((config) => createPromiseEvent(config, referenceTime));

//Text order matches execution order
//for...of needed: await suspends loop
async function runEvents() {
  const register = [];

  try {
    for (const event of events) {
      register.push(await event());
    }
    printReport('async/await', register);
  } catch (error) {
    printFailure(error);
    printReport('async/await (cadena interrumpida)', register);
  }
}

runEvents();
