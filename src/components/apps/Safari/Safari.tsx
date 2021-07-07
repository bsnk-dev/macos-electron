import { useReducer, useRef } from 'react';
import { mdiChevronLeft, mdiChevronRight, mdiClose, mdiDivision, mdiMinus, mdiPercentOutline, mdiPlusMinusVariant } from '@mdi/js';
import clsx from 'clsx';
import { AppIcon } from '__/components/utils/AppIcon';
import {
  ActionT,
  safariReducer,
  initialState,
  IState,
} from './SafariReducer';
import css from './Safari.module.scss';

const Safari = () => {
  const [state, dispatch] = useReducer<React.Reducer<IState, ActionT>>(
    safariReducer,
    initialState,
  );

  const { address } = state;

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      setAddress({ type: 'setAddress', payload: e.target.value });
    }
  }

  const iframeEl = useRef();

  function setAddress(action: ActionT) {
    dispatch(action);
    
    //@ts-ignore
    if (iframeEl && iframeEl.current) iframeEl.current.src = action.payload;
  }

  function go(type: 'goForwards' | 'goBack') {
    const currentAddress = state.address;

    dispatch({type: type, payload: ''});
    
    //@ts-ignore
    if (iframeEl && iframeEl.current && (currentAddress != state.address)) iframeEl.current.src = state.address;
  }



  return (
    <section class={css.container}>
      <header class={clsx('app-window-drag-handle', css.header)} />
      <section class={css.mainArea}>
        <div className={css.calendarHeader}>
          <div className={css.controlButtons}>
            <button onClick={() => go('goBack')}>
              <AppIcon size={32} path={mdiChevronLeft} />
            </button>
            <button onClick={() => go('goForwards')}>
              <AppIcon size={32} path={mdiChevronRight} />
            </button>
            <input 
              placeholder="Search" 
              value={address} 
              onKeyUp={(e) => handleKeyPress(e)}
            ></input>
          </div>
        </div>
        
        <iframe src={address} ref={iframeEl} height="100%" onLoad={(e) => { 
          dispatch({ type: 'setAddress', payload: e.path[0].contentWindow.location.href })
          console.log(e.path[0].contentWindow.location.href);
        }  
        }>

        </iframe>
      </section>
    </section>
  );
};

export default Safari;
