export interface IState {
  address: string;
}

export interface ActionT {
  type: 'setAddress';
  payload: string | number;
}

export const initialState: IState = {
  address: 'https://google.com',
};

export function safariReducer(state: IState, action: ActionT): IState {
  const { type, payload } = action;

  if (type == 'setAddress') {
    
  }

  switch (type) {
    case 'setAddress':
      state.address = payload as string;

      return state;
  }

  return initialState;
}
