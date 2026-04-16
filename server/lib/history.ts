const history: any[] = [];

export const add = (entry: any) => {
  history.push({ ...entry, ts: Date.now() });
  if (history.length > 50) history.shift();
};

export const get = () => history;
