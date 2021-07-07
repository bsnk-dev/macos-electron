import { useReducer, useRef } from 'react';
import { mdiChevronLeft, mdiChevronRight, mdiRefresh } from '@mdi/js';
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
      dispatch({ type: 'setAddress', payload: e.target.value });
      iframeEl.current.loadURL(e.target.value);
    }
  }

  const iframeEl = useRef();

  function go(type: 'goForwards' | 'goBack') {
    (type == 'goForwards') 
      ? iframeEl.current.goForward() 
      : iframeEl.current.goBack();

    refreshSiteDetails();
  }

  function refresh() {
    iframeEl.current.reload()
  }

  function refreshSiteDetails() {
    dispatch({type: 'setAddress', payload: iframeEl.current.getURL()});
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
            <div style={{width: '100%', display: 'flex'}}>
              <input 
                placeholder="Search" 
                value={address} 
                onKeyUp={(e) => handleKeyPress(e)}
              />

              <button style={{marginRight: 'auto'}} onClick={refresh}>
                <AppIcon size={20} path={mdiRefresh} />
              </button>
            </div>
          </div>
        </div>
        
        <webview src={address} ref={iframeEl} style={{height: '100%', width: '99.9%', marginLeft: '0.1%'}}>

        </webview>
      </section>
    </section>
  );
};

export default Safari;
