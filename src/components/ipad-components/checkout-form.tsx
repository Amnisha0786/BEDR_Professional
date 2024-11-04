import React, { useMemo } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';

import { Button } from '../ui/button';
import useUrl from '@/hooks/useUserUrl';

const CheckoutForm = () => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const userUrl = useUrl();

  const returnUrl = useMemo(() => {
    if (userUrl?.url) {
      return userUrl?.url;
    }
  }, [userUrl?.url]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements || !returnUrl) {
      return;
    }
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${returnUrl}/payment-success` as string,
      },
    });
    if (error) {
      console.error(t('translation.somethingWentWrong'));
    }
  };

  return (
    <div className='px-[10rem] py-[10rem]'>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button
          type='submit'
          className='mt-4 w-full'
          disabled={!stripe || !elements}
        >
          Pay
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
