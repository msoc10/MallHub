import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatError(ex) {
  const response = ex.response;
  const status = response.status;

  let detail = response?.data?.Details || response?.data?.detail
  console.log(detail)


  if (status === 400 && response.data.errors) {
    const errors = response.data.errors;
    const firstKey = Object.keys(errors)[0];
    detail = errors[firstKey];
  }


  return {
    status: status,
    title: response.statusText,
    description: detail
  }
}

export const formatDateTime = (dateString) => {
  const dateTimeOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};