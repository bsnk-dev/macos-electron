export interface IState {
  address: string;
  tabs: {
    id: number;
    url: string;
    isActive: boolean,
  }[];
  lastID: number;
}

export interface ActionT {
  type: 'setAddress' | 'addTab' | 'removeTab' | 'changeActiveTab';
  payload: string | number | {url: string};
}

export const initialState: IState = {
  address: 'https://google.com',
  tabs: [{
    id: 0,
    url: 'https://google.com',
    isActive: true,
  }, 
  {
    id: 1,
    url: 'https://bsnk.dev',
    isActive: false,
  }],
  lastID: 1,
};

function changeActiveTab(state: IState, tabID: number) {
  for (const tab of state.tabs) {
    tab.isActive = (tab.id === tabID);

    if (tab.id === tabID) state.address = tab.url;
  }
}

export function safariReducer(state: IState, action: ActionT): IState {
  const { type, payload } = action;

  switch (type) {
    case 'setAddress': {
      state.address = payload as string;

      for (const tab of state.tabs) {
        if (tab.isActive) tab.url = payload as string;
      }

      return state;
    } case 'addTab': {
      state.tabs.push({
        id: state.lastID + 1,
        url: (payload as {url: string}).url,
        isActive: true,
      });

      changeActiveTab(state, state.lastID + 1);

      state.lastID++;

      return state;
    } case 'removeTab': {
      // ...
    } case 'changeActiveTab': {
      changeActiveTab(state, payload as number);

      return state;
    }
  }

  return initialState;
}
