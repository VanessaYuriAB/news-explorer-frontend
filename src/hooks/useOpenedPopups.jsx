import { useCallback } from 'react';
import Signin from '../components/Popups/components/Signin/Signin';
import Signup from '../components/Popups/components/Signup/Signup';
import SignupTooltip from '../components/Popups/components/SignupTooltip/SignupTooltip';
import SearchTooltip from '../components/Popups/components/SearchTooltip/SearchTooltip';

// Hook para abertura e criação dos objetos popups (exceto ApiErrorTooltip)
// Para evitar código redundante

function useOpenedPopups({ handleOpenPopup }) {
  const openPopup = useCallback(
    (type, tooltipType = '') => {
      if (type === 'signin') {
        handleOpenPopup({
          type: 'signin',
          children: <Signin />,
        });
        return;
      }

      if (type === 'signup') {
        handleOpenPopup({
          type: 'signup',
          children: <Signup />,
        });
        return;
      }

      if (type === 'tooltip' && !tooltipType) return;

      if (type === 'tooltip') {
        if (tooltipType === 'signupSuccess') {
          handleOpenPopup({
            type: 'tooltip',
            tooltipType: 'signupSuccess',
            children: <SignupTooltip />,
          });
          return;
        }

        if (tooltipType === 'search') {
          handleOpenPopup({
            type: 'tooltip',
            tooltipType: 'search',
            children: <SearchTooltip />,
          });
          return;
        }
      }
    },
    [handleOpenPopup],
  );

  const openSignin = useCallback(() => openPopup('signin'), [openPopup]);
  const openSignup = useCallback(() => openPopup('signup'), [openPopup]);
  const openSignupTooltip = useCallback(
    () => openPopup('tooltip', 'signupSuccess'),
    [openPopup],
  );
  const openSearchTooltip = useCallback(
    () => openPopup('tooltip', 'search'),
    [openPopup],
  );

  return { openSignup, openSignin, openSignupTooltip, openSearchTooltip };
}

export default useOpenedPopups;
