import { useReducer, useRef } from 'react';
import { mdiChevronLeft, mdiChevronRight, mdiRefresh, mdiPlus, mdiClose } from '@mdi/js';
import clsx from 'clsx';
import { AppIcon } from '__/components/utils/AppIcon';
import {
  ActionT,
  safariReducer,
  initialState,
  IState,
} from './SafariReducer';
import css from './Safari.module.scss';
import { useEffect } from 'preact/hooks';

const Safari = () => {
  const [state, dispatch] = useReducer<React.Reducer<IState, ActionT>>(
    safariReducer,
    initialState,
  );

  function handleKeyPress(e: any) {
    if (e.key === 'Enter') {
      let queryOrAddress = e.target.value;

      if (!queryOrAddress.startsWith('http://') || !queryOrAddress.startsWith('https://')) queryOrAddress = `https://google.com/search?q=${encodeURIComponent(queryOrAddress)}`;

      dispatch({ type: 'setAddress', payload: queryOrAddress });
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

  function newTab() {
    dispatch({type: 'addTab', payload: 'https://google.com/'});
  }

  function closeTab(tabID: number) {
    dispatch({type: 'removeTab', payload: tabID});
  }

  function refreshSiteDetails() {
    dispatch({type: 'setAddress', payload: iframeEl.current.getURL()});
  }

  useEffect(() => {
    if (iframeEl && iframeEl.current) {
      iframeEl.current.addEventListener('load-commit', (e) => {
        iframeEl.current.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.123 Safari/537.36');
      
        refreshSiteDetails();

        iframeEl.current.insertCSS(`::-webkit-scrollbar { width: 8px; /* 1px wider than Lion. */ /* This is more usable for users trying to click it. */ background-color: rgba(0,0,0,0); -webkit-border-radius: 100px; } /* hover effect for both scrollbar area, and scrollbar 'thumb' */ ::-webkit-scrollbar:hover { background-color: rgba(0, 0, 0, 0.09); }

        /* The scrollbar 'thumb' ...that marque oval shape in a scrollbar */ ::-webkit-scrollbar-thumb:vertical { /* This is the EXACT color of Mac OS scrollbars. Yes, I pulled out digital color meter */ background: rgba(0,0,0,0.5); -webkit-border-radius: 100px; } ::-webkit-scrollbar-thumb:vertical:active { background: rgba(19, 5, 5, 0.61); /* Some darker color when you click it */ -webkit-border-radius: 100px; }
       
        background: linear-gradient(45deg, white, silver); min-height: 100%;`);
      });
    }
  });

  function tabRow() {
    if (state.tabs.length < 2) return '';
    
    return state.tabs.map(tab => (
      <div 
        class={(tab.isActive) ? 'tab' : 'tab inactive'}
        style={{width: (100 / state.tabs.length)+'%'}}
        onClick={() => dispatch({type: 'changeActiveTab', payload: tab.id})}
      >
        <div style={{textAlign: 'left'}}>
          <button class={css.button} onClick={() => closeTab(tab.id)}>
            <AppIcon size={14} path={mdiClose}></AppIcon>
          </button>
        </div>

        <div style={{margin: 'auto'}}>
          { tab.url.slice(0, 24) }
        </div>
      </div>
    ));
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
                value={state.address} 
                onKeyUp={(e) => handleKeyPress(e)}
              />

              <button style={{marginRight: 'auto'}} onClick={refresh}>
                <AppIcon size={20} path={mdiRefresh} />
              </button>
            </div>

            <button onClick={newTab}>
                <AppIcon size={20} path={mdiPlus} />
              </button>
          </div>

          <div class={css.tabs}>
            { tabRow() }
          </div>
        </div>
        
        <webview src={state.address} ref={iframeEl} style={{height: 'calc(100%)', width: 'calc(100% - 2px)', marginLeft: '1px'}}>

        </webview>
      </section>
    </section>
  );
};

export default Safari;
