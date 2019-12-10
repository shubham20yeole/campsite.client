import moment from "react-moment";

const axios = require("axios");
const BASE_PATH = "http://localhost:8080";

export const dateToString = date => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const api = {
  getAllAvailabilities: () => {
    return axios.get(`${BASE_PATH}/booking/dates`);
  },
  requestDateRange: (startDate, endDate) => {
    return axios.get(
      `${BASE_PATH}/booking/dates?from=${dateToString(
        startDate
      )}&to=${dateToString(endDate)}`
    );
  },
  postBooking: booking => {
    return axios.post(`${BASE_PATH}/booking`, booking);
  },
  cancelBooking: bookingId => {
    return axios.delete(`${BASE_PATH}/booking/${bookingId}`);
  }
};

export const getDates = (startDate, stopDate, onlyWorkingDays) => {
  let doWd = typeof onlyWorkingDays === "undefined" ? false : onlyWorkingDays;

  let dateArray = [];
  let dayNr;
  let runDateObj = moment(startDate);
  let stopDateObj = moment(stopDate);
  debugger;
  while (runDateObj <= stopDateObj) {
    dayNr = runDateObj.day();
    if (!doWd || (dayNr > 0 && dayNr < 6)) {
      dateArray.push(moment(runDateObj).format("YYYY-MM-DD"));
    }
    moment.add(1, "MM").format("YYYY-MM-DD");
    runDateObj = moment(runDateObj).add(1, "days");
  }
  return dateArray;
};
