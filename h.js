// const currentDate = new Date();
// const options = {
//   timeZone: "Europe/Bucharest",
//   weekday: "short",
//   month: "short",
//   day: "2-digit",
//   year: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   timeZoneName: "short",
// };
// const easternEuropeTime = currentDate.toLocaleString("en-US", options);
// const time = easternEuropeTime.match(/\d{2}:\d{2}:\d{2}/)[0];
// const date = easternEuropeTime.match(
//   /[a-zA-Z]{3}, [a-zA-Z]{3} \d{2}, \d{4}/
// )[0];
// console.log(easternEuropeTime)


// Define the two date strings
const date1 = "Sun, Jan 26, 2025, 02:46:48 AM GMT+2";
const date2 = "Sun, Jan 26, 2025, 02:43:48 AM GMT+2";

// // Define the options for formatting
const options = {
  timeZone: "Europe/Bucharest",
  weekday: "short",
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

// Convert the date strings to Date objects
const dateObj1 = new Date(date1);
const dateObj2 = new Date(date2);
const currentDate = new Date();
const formattedCurrentDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);

// Format the dates using Intl.DateTimeFormat
const formattedDate1 = new Intl.DateTimeFormat("en-US", options).format(dateObj1);
const formattedDate2 = new Intl.DateTimeFormat("en-US", options).format(dateObj2);
console.log(formattedCurrentDate)
// Compare the dates
if (dateObj1 > currentDate) {
    console.log(`Date 1 (${dateObj1}) is later than Date 2 (${currentDate})`);
} else if (dateObj1 < currentDate) {
    console.log(`Date 1 (${dateObj1}) is earlier than Date 2 (${currentDate})`);
} else {
    console.log(`Both dates (${formattedDate1} and ${formattedDate2}) are equal`);
}




// get current 
// const currentDate = new Date();
// const options = {
//   timeZone: "Europe/Bucharest",
//   weekday: "short",
//   month: "short",
//   day: "2-digit",
//   year: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   timeZoneName: "short",
// };
// const easternEuropeTime = currentDate.toLocaleString("en-US", options);
// const time = easternEuropeTime.match(/\d{2}:\d{2}:\d{2}/)[0];
// const date = easternEuropeTime.match(
//   /[a-zA-Z]{3}, [a-zA-Z]{3} \d{2}, \d{4}/
// )[0];
// console.log(easternEuropeTime)



// Example start date and start time
// const startDate = '2025-01-26'; // 'YYYY-MM-DD' format
// const startTime = '20:30'; // 'HH:MM' format

// // Combine the date and time into a single string
// const combinedDateTime = `${startDate}T${startTime}:00`; // 'YYYY-MM-DDTHH:MM:SS'

// // Create a Date object from the combined string
// const dateObj = new Date(combinedDateTime);

// // Define the options for formatting
// const options = {
//   timeZone: "Europe/Bucharest",
//   weekday: "short",
//   month: "short",
//   day: "2-digit",
//   year: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   timeZoneName: "short",
// };

// // Format the date using Intl.DateTimeFormat
// const formattedDate = new Intl.DateTimeFormat("en-US", options).format(dateObj);

// console.log(formattedDate);
