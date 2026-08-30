const { printReport } = require('./analysis');

//Edge case: macrotask queue starvation
//Three alarms expire while blocked
//A microtask jumps ahead

//Block outlasts the latest alarm
const BLOCK_DURATION_MS = 350;
const REPORT_DELAY_MS = 100;

const CONCURRENT_NOTICES = [
  { name: 'noticeA', type: 'aviso corto', delay: 100 },
  { name: 'noticeB', type: 'aviso corto', delay: 200 },
  { name: 'noticeC', type: 'aviso largo', delay: 300 },
];

const BLOCK_END_NOTICE = {
  name: 'noticeD',
  type: 'aviso corto',
  delay: BLOCK_DURATION_MS,
};

const referenceTime = Date.now();
const register = [];

function recordNotice(config) {
  register.push({
    eventName: config.name,
    eventType: config.type,
    scheduledTime: referenceTime + config.delay,
    realTime: Date.now(),
  });
}

//Active wait holds the stack
function blockCallStack(durationMs) {
  const blockStart = Date.now();
  while (Date.now() - blockStart < durationMs) {
    //Empty: control never returns here
  }
}

//map would collect unused ids
CONCURRENT_NOTICES.forEach((config) => {
  setTimeout(() => recordNotice(config), config.delay);
});

blockCallStack(BLOCK_DURATION_MS);

Promise.resolve().then(() => recordNotice(BLOCK_END_NOTICE));

setTimeout(() => printReport('caso limite - bloqueo sincronico', register), REPORT_DELAY_MS);
