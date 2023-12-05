import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { formatBalance } from '@polkadot/util';
import useCurrentFreeBalance from '@/hooks/space/useCurrentFreeBalance';
import { useTx } from '@/hooks/useink/useTx';
import { step2Schema } from '@/pages/SpaceLauncher';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { Pricing, RegistrationType } from '@/types';
import { messages } from '@/utils/messages';
import { stringToNum } from '@/utils/number';
import { useFormik } from 'formik';

export default function Membership() {
  const { network, config, isOwner, contract } = useSpaceContext();
  const freeBalance = useCurrentFreeBalance();
  const updateConfigTx = useTx(contract, 'updateConfig');

  const readOnly = !isOwner;

  const pricing = config
    ? typeof config.pricing === 'object'
      ? Object.keys(config.pricing)[0]
      : config.pricing
    : null;
  // @ts-ignore
  const pricingInfo = pricing && typeof config?.pricing === 'object' ? config.pricing[pricing] : null;

  const realPrice = formatBalance(stringToNum(pricingInfo?.price) || '', {
    decimals: network.decimals,
    forceUnit: network.symbol,
    withUnit: false,
    withZero: false,
  });

  const formik = useFormik({
    initialValues: {
      registrationType: config?.registration || RegistrationType.PayToJoin,
      pricing: pricing || Pricing.Free,
      price: realPrice || '',
      duration: pricingInfo?.duration || '',
    },
    validationSchema: step2Schema,
    enableReinitialize: true,
    onSubmit: (values, formikHelpers) => {
      if (freeBalance == 0) {
        toast.error(messages.insufficientBalance);
        return;
      }

      const { registrationType, pricing, price, duration } = values;
      const rawPrice = parseInt(price) * Math.pow(10, network.decimals);
      let spacePricing: any = pricing;
      if (pricing === Pricing.OneTimePaid) {
        spacePricing = { [pricing]: { price: rawPrice } };
      } else if (pricing === Pricing.Subscription) {
        spacePricing = { [pricing]: { price: rawPrice, duration: parseInt(duration) } };
      }

      const spaceConfig = {
        registration: registrationType,
        pricing: spacePricing,
      };

      updateConfigTx.signAndSend([spaceConfig], {}, (result) => {
        if (result?.isInBlock) {
          if (result.dispatchError) {
            toast.error(result.dispatchError.toString());
          } else {
            formikHelpers.setSubmitting(false);
            toast.success('Space membership updated');
          }
        }
      });
    },
  });

  if (!config) {
    return null;
  }

  return (
    <Box mt={3} border='1px' borderColor='gray.200' p={4} borderRadius={4} mb={4}>
      <Text fontWeight='semibold'>Membership</Text>
      <Box ml={2} as='form' onSubmit={formik.handleSubmit}>
        <FormControl mt={4} isRequired>
          <FormLabel>Registration</FormLabel>
          <RadioGroup colorScheme='primary' name='registrationType' defaultValue={RegistrationType.PayToJoin}>
            <Stack spacing={0}>
              <Radio value={RegistrationType.PayToJoin} onChange={formik.handleChange} isDisabled={readOnly}>
                Pay To Join
              </Radio>
              <Text ml={6} mb={2} fontSize='sm' color='gray.500'>
                Users pay directly to join the space without admins without admin reviews or approvals.
              </Text>
              <Radio value={RegistrationType.RequestToJoin} onChange={formik.handleChange} isDisabled={readOnly}>
                Request To Join
              </Radio>
              <Text ml={6} mb={2} fontSize='sm' color='gray.500'>
                Users pay to make a request, join upon admin approval, and receive a refund if rejected.
              </Text>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl mt={4} isRequired>
          <FormLabel>Pricing</FormLabel>
          <RadioGroup colorScheme='primary' name='pricing' value={formik.values.pricing || Pricing.Free}>
            <Stack spacing={1}>
              <Radio value={Pricing.Free} onChange={formik.handleChange} isDisabled={readOnly}>
                Free
              </Radio>
              <Radio value={Pricing.OneTimePaid} onChange={formik.handleChange} isDisabled={readOnly}>
                One Time Paid
              </Radio>
              <Radio value={Pricing.Subscription} onChange={formik.handleChange} isDisabled={readOnly}>
                Subscription
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {(formik.values.pricing === Pricing.OneTimePaid || formik.values.pricing === Pricing.Subscription) && (
          <FormControl mt={4} isRequired isInvalid={formik.touched.price && !!formik.errors.price}>
            <FormLabel>Price</FormLabel>
            <InputGroup>
              <Input
                type='number'
                placeholder='10'
                width={200}
                value={formik.values.price}
                onChange={formik.handleChange}
                readOnly={readOnly}
                name='price'
              />
              <InputRightAddon children={network?.symbol} />
            </InputGroup>
            {formik.touched.price && !!formik.errors.price ? (
              <FormErrorMessage>{formik.errors.price as string}</FormErrorMessage>
            ) : (
              <FormHelperText />
            )}
          </FormControl>
        )}

        {formik.values.pricing === Pricing.Subscription && (
          <FormControl mt={4} isRequired isInvalid={formik.touched.duration && !!formik.errors.duration}>
            <FormLabel>Duration</FormLabel>
            <InputGroup>
              <Input
                type='number'
                placeholder='30'
                width={200}
                value={formik.values.duration}
                onChange={formik.handleChange}
                readOnly={readOnly}
                name='duration'
              />
              <InputRightAddon children='days' />
            </InputGroup>
            {formik.touched.duration && !!formik.errors.duration ? (
              <FormErrorMessage>{formik.errors.duration as string}</FormErrorMessage>
            ) : (
              <FormHelperText />
            )}
          </FormControl>
        )}

        {isOwner && (
          <Button
            type='submit'
            mt={4}
            size='sm'
            variant='outline'
            colorScheme='primary'
            isDisabled={formik.isSubmitting}>
            Update Membership
          </Button>
        )}
      </Box>
    </Box>
  );
}
