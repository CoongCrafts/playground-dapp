import {
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Props } from '@/types';
import { renderMd } from '@/utils/mdrenderer';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface EditPostModalProps extends Props {
  title: string;
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (values: { content: string }) => void;
  defaultValue?: string;
  shouldDisable: boolean;
  action: string;
}

export default function EditPostModal({
  title,
  action,
  onClose,
  isOpen,
  onSubmit,
  shouldDisable,
  defaultValue = '',
}: EditPostModalProps) {
  const formik = useFormik({
    initialValues: {
      content: defaultValue,
    },
    validationSchema: yup.object().shape({
      content: yup.string().required().max(500),
    }),
    onSubmit: onSubmit,
  });

  useEffect(() => {
    formik.resetForm();
    // Set content by updated value
    formik.setValues({ content: defaultValue });
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: '3xl' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Tabs variant='enclosed' borderStyle='solid' borderWidth={1} borderRadius={6} size='md'>
              <TabList>
                <Tab border='none' _selected={{ bg: 'white', borderRight: '1px solid lightgray' }}>
                  Write
                </Tab>
                <Tab
                  border='none'
                  _selected={{
                    bg: 'white',
                    borderRight: '1px solid lightgray',
                    borderLeft: '1px solid lightgray',
                  }}>
                  Preview
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                    <Textarea
                      height={40}
                      size='md'
                      id='content'
                      name='content'
                      value={formik.values.content}
                      placeholder='What do you want to share?'
                      autoFocus
                      onChange={formik.handleChange}
                    />
                    {formik.touched.content && !!formik.errors.content && (
                      <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                    )}
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <Box
                    height={40}
                    py={2}
                    px={4}
                    className='post-content'
                    dangerouslySetInnerHTML={{ __html: renderMd(formik.values.content || '') }}></Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter justifyContent='space-between' alignItems='center'>
            <Text fontSize='sm' color='dimgray'>
              Markdown supported, maximum 500 characters
            </Text>
            <Flex>
              <Button size='sm' variant='ghost' mr={2} onClick={onClose} isDisabled={shouldDisable}>
                Close
              </Button>
              <Button
                size='sm'
                colorScheme='primary'
                type='submit'
                width={100}
                isDisabled={shouldDisable || formik.values.content === defaultValue}>
                {action}
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
