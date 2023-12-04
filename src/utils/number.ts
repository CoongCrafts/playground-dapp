export const stringToNum = (input: string | undefined): number | undefined => {
  if (input === undefined) {
    return undefined;
  }

  return parseInt(input.replaceAll(',', ''));
};
