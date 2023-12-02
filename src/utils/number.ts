export const stringToNum = (input: string | undefined): number | undefined => {
  if (input === undefined) {
    return undefined;
  }

  return parseInt(input);
};

export const timestampToNum = (input: number): number => {
  return parseInt(input.toString().replaceAll(',', ''));
};
