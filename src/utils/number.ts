export const stringToNum = (input: string | undefined): number | undefined => {
  if (input === undefined) {
    return undefined;
  }

  return parseFloat(input.replaceAll(',', ''));
};
