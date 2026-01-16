import { CustomHeader } from '@/src/components/common/CustomHeader';
import { CheckoutPage } from '@/src/components/screen/checkout';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { logger } from '@/src/utils/logger';
import { Redirect } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

export default function Checkout() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get('numberId');

  if (!id || id === null) {
    logger.error('No numberId provided', {
      userId: user?.id,
      numberId: id,
    });
    return <Redirect href="/" />;
  }

  return (
    <>
      <CustomHeader back={true} />
      <CheckoutPage id={id.toString()} />
    </>
  );
}
