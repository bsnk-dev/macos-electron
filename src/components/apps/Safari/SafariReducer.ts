export interface IState {
  address: string;
  history: string[];
  historyIndex: number;
}

export interface ActionT {
  type: 'goBack' | 'goForwards' | 'setAddress';
  payload: string | number;
}

export const initialState: IState = {
  address: 'https://bing.com',
  history: ['https://bing.com'],
  historyIndex: 0,
};

export function safariReducer(state: IState, action: ActionT): IState {
  const { type, payload } = action;

  if (type == 'setAddress') {
    
  }

  switch (type) {
    case 'setAddress':
      state.address = payload as string;

      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(payload as string);

      state.historyIndex++;

      console.log(state.history);

      return state;
    case 'goBack':
      state.historyIndex--;
      if (state.historyIndex < 0) state.historyIndex = 0;

      state.address = state.history[state.historyIndex];

      return state;
    case 'goForwards':
      state.historyIndex++;
      if (state.historyIndex > (state.history.length - 1)) state.historyIndex = state.history.length - 1;

      state.address = state.history[state.historyIndex];

      return state;
  }

  return initialState;
}
