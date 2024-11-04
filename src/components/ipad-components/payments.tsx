import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { TGetUnpaidFileData } from '@/models/types/ipad';
import CheckoutForm from './checkout-form';
import useUserProfile from '@/hooks/useUserProfile';
import { checkoutSession } from '@/app/api/ipad-unpaid-files';
import { getErrorMessage } from '@/lib/utils';

type Tprops = {
  fileData?: TGetUnpaidFileData | null;
};

const Payments = ({ fileData }: Tprops) => {
  const userStripeKey = useUserProfile();
  const { t } = useTranslation();
  const [clientSecret, setClientSecret] = useState('');

  const stripePublishableKey = useMemo(() => {
    if (userStripeKey?.stripePublishableKey) {
      return userStripeKey?.stripePublishableKey;
    }
  }, [userStripeKey?.stripePublishableKey]);

  const stripePromise = useMemo(() => {
    if (stripePublishableKey) {
      return loadStripe(stripePublishableKey);
    }
    return null;
  }, [stripePublishableKey]);

  const createPaymentIntent = useCallback(async () => {
    try {
      const response = await checkoutSession({
        patientFileId: fileData?.id as string,
        email: fileData?.patient?.email as string,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      setClientSecret(response?.data?.data?.paymentIntent?.clientSecret);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, []);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  return (
    clientSecret && (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    )
  );
};

export default Payments;
