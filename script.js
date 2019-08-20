let months = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień"
];

let currentTimeBox = document.querySelector(".current-time-box");
let eventsBox = document.querySelector(".events-box");

let data;

//Funkcja pomocnicza do formatowania daty

let formatDate = function(element) {
  return `${element.getUTCDate()} ${
    months[element.getUTCMonth()]
  } ${element.getUTCFullYear()}, godzina: ${
    element.getUTCHours() < 10
      ? "0" + element.getUTCHours()
      : element.getUTCHours()
  }:${
    element.getUTCMinutes() < 10
      ? "0" + element.getUTCMinutes()
      : element.getUTCMinutes()
  }`;
};

//Funkcja pomocnicza do tworzenia elementów DOM

let createElement = function(parent, className, elementType) {
  let element = document.createElement(elementType);
  element.classList.add(className);
  parent.insertBefore(element, parent.firstChild);
  return element;
};

//Funkcja przyspieszająca czas i wywołująca sprawdzenie aktualnych wydarzeń

let displayDate = function(currentDate) {
  currentDate.setSeconds(currentDate.getSeconds() + 10);
  currentTimeBox.textContent = formatDate(currentDate);
  if (data.length == 0) return;
  setTimeout(() => {
    checkEvents(currentDate);
    displayDate(currentDate);
  }, 1);
};

//Funkcja sprawdzająca, czy wydarzenie się wydarzylo

let checkEvents = function(currentDate) {
  data = data.filter(element => {
    if (
      Date.parse(element.date) < currentDate.getTime() &&
      element.title != ""
    ) {
      let eventContainer = createElement(eventsBox, "event-container", "div");
      let eventText = createElement(eventContainer, "event-text", "span");
      let eventHeaderContainer = createElement(
        eventContainer,
        "event-header-container",
        "span"
      );

      let eventDate = createElement(eventHeaderContainer, "event-date", "span");
      let eventTitle = createElement(eventHeaderContainer, "event-title", "h2");

      eventText.textContent = element.description;
      eventTitle.textContent = element.title;
      let myDate = new Date(element.date);
      eventDate.textContent = formatDate(myDate);
    }
    return Date.parse(element.date) > currentDate.getTime();
  });
};

fetch("http://localhost:7000")
  .then(response => response.json())
  .then(myJson => {
    data = myJson;
    console.log(data);
    let date = new Date();
    displayDate(date);
  });
