import { fromEvent } from 'rxjs';
import { filter, scan } from 'rxjs/operators';

/**
 * Process actions: form a new state object.
 */
const mutateState = (state, e) => {
  const node = e.target;
  switch (node.dataset.action) {
    case 'prev':
      return {
        ...state,
        currentTab: state.currentTab - 1,
      };
    case 'next':
      return {
        ...state,
        currentTab: state.currentTab + 1,
      };
    case 'jump':
      return {
        ...state,
        currentTab: node.dataset.index - 1,
      };
    default:
      // Unknown action!
      return state;
  }
};

/**
 * Use the state to update the DOM.
 *
 * Mutations go here: not a pure functions.
 */
const paint = (context, state) => {
  // Show the active tab
  context.tabs.map(
    (tab, index) => tab.setAttribute(
      'aria-hidden',
      index === state.currentTab ? 'false' : 'true'
    )
  );

  // Highlight the active tab
  context.nav.querySelectorAll('button[data-action="jump"]').forEach(
    (button, index) => button.classList.toggle('is-active', index === state.currentTab)
  );

  // Disable next/prev
  context.prev.disabled = state.currentTab === 0;
  context.next.disabled = state.currentTab === context.tabs.length - 1;
};

/**
 * Your regular enhancer.
 * Should do nothing more but glue events to state changes to DOM updates.
 */
export const enhancer = rootElement => {
  // Create the default state
  const defaultState = {
    currentTab: 0,
  };

  // I like a separate context object tracking my DOM nodes
  const context = {
    tabs: [...rootElement.querySelectorAll('.tab')],
    prev: rootElement.querySelector('[data-action="prev"]'),
    next: rootElement.querySelector('[data-action="next"]'),
    nav: rootElement.querySelector('nav'),
  };

  paint(context, defaultState);

  // Select *only* button clicks
  const buttonClicks = fromEvent(rootElement, 'click')
    .pipe(filter(x => x.target.nodeName === 'BUTTON'));

  const clicksToState = buttonClicks
    .pipe(
      // Update state (scan is like reduce)
      scan(
        mutateState,
        defaultState
      )
    );

  // Re-paint when state changes
  clicksToState.subscribe(state => paint(context, state));
};
