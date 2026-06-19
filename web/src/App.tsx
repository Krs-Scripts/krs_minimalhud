import { useState } from 'react';
import Status from './components/Status';
import CarHUD from './components/CarHUD'; 
import Compass from './components/Compass';
import Logo from './components/Logo'; 
import Cinematic from './components/Cinematic';
import MenuSettings from './components/MenuSettings';
import { useNuiEvent } from './hooks/useNuiEvent';

const App = () => {
  const [showStatus, setShowStatus] = useState(true);
  const [showCarHUD, setShowCarHUD] = useState(false); 
  const [hideAll, setHideAll] = useState(false);
  
  useNuiEvent<boolean>('setShowStatus', setShowStatus);
  useNuiEvent<boolean>('setShowCarHUD', setShowCarHUD);
  useNuiEvent<boolean>('setHideAll', setHideAll);

  return (
    <>
      <Cinematic />
      <MenuSettings />

      {!hideAll && (
        <>
          <Logo /> 

          {showStatus && <Status />}

          {showCarHUD && (
            <>
              <CarHUD />
              <Compass /> 
            </>
          )}
        </>
      )}
    </>
  );
};

export default App;