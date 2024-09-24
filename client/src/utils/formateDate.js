export const formateDate = (date, config) => {
  const defaultOtions = { day: "numeric", month: "short", year: "numeric" };

  const options = config ? config : defaultOtions;

  return new Date(date).toLocaleDateString("en-In", options);
};
