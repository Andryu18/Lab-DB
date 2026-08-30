const { EVENTS, createCallbackEvent } = require('./eventsData');
const { printReport, printFailure } = require('./analysis');

const referenceTime = Date.now();
const register = [];

const [eventOne, eventTwo, eventThree, eventFour, eventFive, eventSix, eventSeven, eventEight] =
  EVENTS.map((config) => createCallbackEvent(config, referenceTime));

//A broken chain leaves gaps
function handleFailure(error) {
  printFailure(error);
  printReport('callbacks anidados (cadena interrumpida)', register);
}

//Handler repeats on eight levels
eventOne((first) => {
  register.push(first);
  eventTwo((second) => {
    register.push(second);
    eventThree((third) => {
      register.push(third);
      eventFour((fourth) => {
        register.push(fourth);
        eventFive((fifth) => {
          register.push(fifth);
          eventSix((sixth) => {
            register.push(sixth);
            eventSeven((seventh) => {
              register.push(seventh);
              eventEight((eighth) => {
                register.push(eighth);
                printReport('callbacks anidados', register);
              }, handleFailure);
            }, handleFailure);
          }, handleFailure);
        }, handleFailure);
      }, handleFailure);
    }, handleFailure);
  }, handleFailure);
}, handleFailure);
