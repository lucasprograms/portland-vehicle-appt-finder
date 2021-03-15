const axios = require("axios");
const dayjs = require("dayjs");
const notifier = require("node-notifier");

const url =
  "https://book.appointment-plus.com/book-appointment/get-grid-hours?startTimestamp=2021-03-11+09%3A19%3A37&endTimestamp=2021-04-10+00%3A00%3A00&limitNumberOfDaysWithOpenSlots=5&employeeId=&services%5B%5D=4881&numberOfSpotsNeeded=1&isStoreHours=true&clientMasterId=399941&toTimeZone=&fromTimeZone=149&_=1615472195207";

const fetchAppointments = () => {
  axios
    .get(url)
    .then((resp) => {
      const { data } = resp.data;
      const { gridHours } = data;

      const firstAvailable = Object.keys(gridHours)[0];

      const day = dayjs(firstAvailable);

      const target = dayjs("2021-03-18");

      const { startTimestamp } = gridHours[firstAvailable].timeSlots;
      const time = dayjs(`${firstAvailable} ${startTimestamp[0]}`);
      const formattedTime = time.format("h:mm A");

      if (day.isBefore(target)) {
        const message = `Appointment found on ${firstAvailable} at ${formattedTime}`;
        notifier.notify({
          message,
          wait: true,
        });
      } else {
        console.log(`Closest slot is ${firstAvailable} at ${formattedTime}`);
      }
    })
    .catch(() => {
      notifier.notify({
        message: `Something went wrong with appointment script`,
        wait: true,
      });
    });
};

fetchAppointments();
setInterval(() => {
  fetchAppointments();
}, 300000);
