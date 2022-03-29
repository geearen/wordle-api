function createKeyDate(prefix: string): string {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const key = `${prefix}-${month}/${day}/${year}`;
  return key;
}

export = createKeyDate;
