import dateFormat from 'dateformat';

export const dateTimeFormater = (dateTime: string): string => {
  const date = new Date(Date.parse(dateTime));
  return dateFormat(date, 'HH:mm dd-mm-yyyy') as string;
};
