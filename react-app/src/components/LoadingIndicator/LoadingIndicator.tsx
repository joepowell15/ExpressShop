import { usePromiseTracker } from 'react-promise-tracker';

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress && <div
    style={{
      position: 'absolute',
      top: '200px',
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100px',
    }}
  >
    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
};

export default LoadingIndicator;
