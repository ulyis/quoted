import answers from "./assets/answers.json";

const DDAY = 283;

const getDayOfYear = (date = new Date()): number => {
  const timestamp1 = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const timestamp2 = Date.UTC(date.getFullYear(), 0, 0);
  const differenceInMilliseconds = timestamp1 - timestamp2;
  const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24;

  return differenceInDays;
};

export const getRealDayNumber = (): number => getDayOfYear() - DDAY;

export const getDayInformation = (
  day?: string | null
): {
  dayNumber: number;
  answer: string;
  quotes: string[];
} => {
  let dayNumber = getRealDayNumber();

  if (day && day in answers) {
    dayNumber = parseInt(day);
  }

  if (dayNumber in answers) {
    const { answer, quotes } = (answers as any)[dayNumber];

    return {
      dayNumber,
      answer,
      quotes,
    };
  }
  console.log(`Day ${dayNumber} not found`);
  const { answer, quotes } = answers[1];

  return {
    dayNumber: 1,
    answer,
    quotes,
  };
};
