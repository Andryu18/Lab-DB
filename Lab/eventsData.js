//Eight notices with distinct delays
//Close pairs: 500/530 and 450/470
//eventFour only fails with --fail
const EVENTS = [
  { name: 'eventOne', type: 'aviso largo', delay: 500 },
  { name: 'eventTwo', type: 'aviso largo', delay: 530 },
  { name: 'eventThree', type: 'aviso corto', delay: 300 },
  { name: 'eventFour', type: 'aviso corto', delay: 450, failsWhenSimulating: true },
  { name: 'eventFive', type: 'aviso corto', delay: 470 },
  { name: 'eventSix', type: 'aviso largo', delay: 1200 },
  { name: 'eventSeven', type: 'aviso largo', delay: 600 },
  { name: 'eventEight', type: 'aviso corto', delay: 150 },
];

//Command line flag for failures
const FAILURE_FLAG = '--fail';

function shouldFail(config) {
  return Boolean(config.failsWhenSimulating) && process.argv.includes(FAILURE_FLAG);
}

function buildFailure(config) {
  return new Error(`El aviso ${config.name} no pudo emitirse`);
}

//All alarms share one reference
//Latency measures attention delay
function buildNotice(config, referenceTime) {
  return {
    eventName: config.name,
    eventType: config.type,
    scheduledTime: referenceTime + config.delay,
    realTime: Date.now(),
  };
}

//Callback style: success and error
function createCallbackEvent(config, referenceTime) {
  return function (onSuccess, onError) {
    setTimeout(() => {
      if (shouldFail(config)) {
        onError(buildFailure(config));
        return;
      }
      onSuccess(buildNotice(config, referenceTime));
    }, config.delay);
  };
}

//Promise style: resolve or reject
function createPromiseEvent(config, referenceTime) {
  return function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail(config)) {
          reject(buildFailure(config));
          return;
        }
        resolve(buildNotice(config, referenceTime));
      }, config.delay);
    });
  };
}

module.exports = { EVENTS, createCallbackEvent, createPromiseEvent };
