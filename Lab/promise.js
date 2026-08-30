const { EVENTS, createPromiseEvent } = require('./eventsData');
const { printReport, printFailure } = require('./analysis');

const referenceTime = Date.now();
const register = [];

const [eventOne, eventTwo, eventThree, eventFour, eventFive, eventSix, eventSeven, eventEight] =
  EVENTS.map((config) => createPromiseEvent(config, referenceTime));

//One catch covers eight then
eventOne()
  .then((first) => {
    register.push(first);
    return eventTwo();
  })
  .then((second) => {
    register.push(second);
    return eventThree();
  })
  .then((third) => {
    register.push(third);
    return eventFour();
  })
  .then((fourth) => {
    register.push(fourth);
    return eventFive();
  })
  .then((fifth) => {
    register.push(fifth);
    return eventSix();
  })
  .then((sixth) => {
    register.push(sixth);
    return eventSeven();
  })
  .then((seventh) => {
    register.push(seventh);
    return eventEight();
  })
  .then((eighth) => {
    register.push(eighth);
    printReport('promesas encadenadas', register);
  })
  .catch((error) => {
    printFailure(error);
    printReport('promesas encadenadas (cadena interrumpida)', register);
  });
