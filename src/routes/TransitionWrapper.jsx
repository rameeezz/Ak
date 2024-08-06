import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TransitionWrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="page"
        timeout={500}
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default TransitionWrapper;
