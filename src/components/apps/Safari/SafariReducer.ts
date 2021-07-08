export interface IState {
  address: string;
  tabs: ITab[];
  lastID: number;
}

interface ITab {
  id: number;
  url: string;
  isActive: boolean,
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
  }],
  lastID: 0,
};

function changeActiveTab(tabs: ITab[], tabID: number) {
  let returnURL = 'https://google.com';
  
  for (const tab of tabs) {
    tab.isActive = (tab.id === tabID);

    if (tab.id === tabID) returnURL = tab.url;
  }

  return returnURL;
}

export function safariReducer(state: IState, action: ActionT): IState {
  const { type, payload } = action;

  switch (type) {
    case 'setAddress': {
      const tabs = JSON.parse(JSON.stringify(state.tabs)) as ITab[];

      for (const tab of tabs) {
        if (tab.isActive) tab.url = payload as string;
      }

      return {
        address: payload as string,
        tabs: tabs,
        lastID: state.lastID,
      };
    } case 'addTab': {
      let tabs: ITab[] = []; 
      tabs = tabs.concat(state.tabs);

      tabs.push({
        id: state.lastID + 1,
        url: payload as string,
        isActive: true,
      });

      const address = changeActiveTab(tabs, state.lastID + 1);

      return {
        ...state,
        address,
        tabs,
        lastID: state.lastID+1,
      };
    } case 'removeTab': {
      let tabs: ITab[] = []; 
      tabs = tabs.concat(state.tabs);

      const tab = tabs.find((tab) => tab.id === payload as number);
      if (!tab) return state;

      const tabIndex = tabs.indexOf(tab);
      
      let nextTab;

      if (tabs[tabIndex - 1]) {
        nextTab = tabs[tabIndex - 1];
      } else {
        nextTab = tabs[tabIndex + 1];
      }

      tabs = tabs.filter((tab) => tab.id !== payload as number);

      const address = changeActiveTab(tabs, nextTab.id);

      return {
        ...state,
        address,
        tabs,
      };
    } case 'changeActiveTab': {
      let tabs: ITab[] = []; 
      tabs = tabs.concat(state.tabs);

      const address = changeActiveTab(tabs, payload as number);

      return {
        ...state,
        tabs,
        address,
      };
    }
  }

  return initialState;
}
