'use client';

import { useParams } from 'react-router-dom';
import {
  useGetMergeRequestItemsQuery,
  useUpdateMergeRequestMutation,
} from '../../store/slices/api/mergeRequestItemsApiSlice';
import {
  Card,
  Flex,
  Text,
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Badge,
  Button,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { formatDate, obtainMergeRequestItemsTable } from '../../utils/common';
import React, { useEffect, useState } from 'react';
import Table from 'antd/es/table';
import { Select, TableColumnsType, Form, FormInstance } from 'antd';
import { MergeRequest } from '../../models/merge-request';
import {
  ChangeStatusButtonType,
  MergeStatus,
  MergeStatusShortCode,
} from '../../utils/shortCodes';
import useModal from '../../hooks/use-modal/use-modal';
import { Modal as CustomModal } from '../../models/modal';

/* eslint-disable-next-line */
export interface MergeRequestDetailProps {}

const steps = [
  { title: 'Waiting' },
  { title: 'Merged' },
  { title: 'Uploaded' },
  { title: 'Completed' },
];

const mergeStatus = [
  { value: 'Merged', label: 'Merged' },
  { value: 'Already Merged', label: 'Already Merged' },
  { value: 'No Need Merge', label: 'No Need Merge' },
];

export function MergeRequestDetail(props: MergeRequestDetailProps) {
  const { mergeRequestId } = useParams();
  const [form] = Form.useForm();
  const { CustomModal, modalHooks } = useModal();
  const [modalConfig, setModalConfig] = useState<CustomModal.Options>();
  const [modalContent, setModalContent] = useState<React.ReactNode>();

  let data: MergeRequest.MergeRequestItemsDataTable[] = [];
  let cDate: string;
  let uDate: string;
  let firstElement: number;
  let stepperIndex = 1;
  let isCompleteBtnDisabled: boolean;

  const {
    data: mergeRequestItems,
    isLoading: isMergeRequestItemsLoading,
    isSuccess: isMergeRequestItemsSuccess,
    isError: isMergeRequestItemsError,
    error: mergeRequestItemsError,
  } = useGetMergeRequestItemsQuery(mergeRequestId);

  const [updateMergeRequest] = useUpdateMergeRequestMutation();

  data = obtainMergeRequestItemsTable(mergeRequestItems?.entities);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ data: data });
    }
  }, [data, form]);

  const { activeStep, setActiveStep } = useSteps({
    index: stepperIndex,
    count: steps.length,
  });

  const onChange = (
    field: string,
    key: React.Key,
    data: Array<MergeRequest.MergeRequestItemsDataTable>,
    value: string,
    form: FormInstance<any>
  ): void => {
    const index = data.findIndex((item) => item.key === key);
    switch (field) {
      case 'feStatus':
        data[index].feStatus = value;
        data = [...data];
        form.setFieldValue('data', data);
        break;
      case 'beStatus':
        data[index].beStatus = value;
        data = [...data];
        form.setFieldValue('data', data);
        break;
      case 'omStatus':
        data[index].omStatus = value;
        data = [...data];
        form.setFieldValue('data', data);
        break;
      default:
        data = [...data];
        form.setFieldValue('data', data);
        break;
    }
  };

  const getFormValue = (
    form: FormInstance<any>,
    key: React.Key,
    field: string
  ): string => {
    if (form.getFieldValue('data')) {
      const index = data.findIndex((item) => item.key === key);
      switch (field) {
        case 'feStatus':
          return form.getFieldValue('data')[index]?.feStatus;
        case 'beStatus':
          return form.getFieldValue('data')[index]?.beStatus;
        case 'omStatus':
          return form.getFieldValue('data')[index]?.omStatus;
        default:
          return '';
      }
    }
    return '';
  };

  const columns: TableColumnsType<MergeRequest.MergeRequestItemsDataTable> = [
    { title: 'Task Name', dataIndex: 'taskName', key: 'taskName' },
    {
      title: 'FE Status',
      dataIndex: 'feStatus',
      key: 'feStatus',
      render: (_, mergeRequest, index) => (
        <Select
          onChange={(value, option) =>
            onChange('feStatus', mergeRequest.key, data, value, form)
          }
          value={getFormValue(form, mergeRequest.key, 'feStatus')}
          options={mergeStatus}
        />
      ),
    },
    {
      title: 'Merged By',
      dataIndex: 'feUser',
      key: 'feUser',
      render: (value, mergeRequest, index) => (
        <p>
          {mergeRequest?.feStatus.toUpperCase() === MergeStatus.WAITING
            ? ''
            : value}
        </p>
      ),
    },
    {
      title: 'BE Status',
      dataIndex: 'beStatus',
      key: 'beStatus',
      render: (_, mergeRequest, index) => (
        <Select
          onChange={(value, option) =>
            onChange('beStatus', mergeRequest.key, data, value, form)
          }
          value={getFormValue(form, mergeRequest.key, 'beStatus')}
          options={mergeStatus}
        />
      ),
    },
    {
      title: 'Merged By',
      dataIndex: 'beUser',
      key: 'beUser',
      render: (value, mergeRequest, index) => (
        <p>
          {mergeRequest?.beStatus.toUpperCase() === MergeStatus.WAITING
            ? ''
            : value}
        </p>
      ),
    },
    {
      title: 'OM Status',
      dataIndex: 'omStatus',
      key: 'omStatus',
      render: (_, mergeRequest, index) => (
        <Select
          onChange={(value, option) =>
            onChange('omStatus', mergeRequest.key, data, value, form)
          }
          value={getFormValue(form, mergeRequest.key, 'omStatus')}
          options={mergeStatus}
        />
      ),
    },
    {
      title: 'Merged By',
      dataIndex: 'omUser',
      key: 'omUser',
      render: (value, mergeRequest, index) => (
        <p>
          {mergeRequest?.omStatus.toUpperCase() === MergeStatus.WAITING
            ? ''
            : value}
        </p>
      ),
    },
  ];

  if (mergeRequestItems) {
    firstElement = Number(Object.keys(mergeRequestItems?.entities)[0]);
    stepperIndex =
      steps.findIndex(
        (item) =>
          item.title ===
          mergeRequestItems?.entities[firstElement]?.mergeRequest?.status?.name
      ) + 1;

    isCompleteBtnDisabled = Object.values(mergeRequestItems?.entities).some(
      (item) =>
        item?.beStatus?.shortCode === MergeStatusShortCode.WAITING &&
        item?.feStatus?.shortCode === MergeStatusShortCode.WAITING &&
        item?.omStatus?.shortCode === MergeStatusShortCode.WAITING
    );
  }

  if (firstElement) {
    cDate = formatDate(
      mergeRequestItems?.entities[firstElement]?.mergeRequest?.cdate
    );
    uDate = formatDate(
      mergeRequestItems?.entities[firstElement]?.mergeRequest?.udate
    );
  }

  useEffect(() => {
    setActiveStep(stepperIndex);
  }, [setActiveStep, stepperIndex]);

  const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    modalHooks.onOpen();
    const btnType = event.currentTarget.id.split('-')[0];
    setModalConfig(obtainModalConfig(btnType));
  };

  const obtainModalConfig = (buttonType: string): CustomModal.Options => {
    let config: CustomModal.Options;
    const commonModalConfig: CustomModal.Options = {
      isCloseButtonActive: true,
      leftButtonProps: {
        props: { variant: 'solid', colorScheme: 'red' },
        isActive: true,
        title: 'Cancel',
        onClick: modalHooks.onClose,
      },
    };

    switch (buttonType.toUpperCase()) {
      case ChangeStatusButtonType.FE:
        return (config = {
          ...commonModalConfig,
          ...commonModalConfig.rightButtonProps,
          modalTitle: 'Are you sure to change FE task status ?',
          rightButtonProps: {
            props: { variant: 'solid', colorScheme: 'facebook' },
            isActive: true,
            title: 'Confirm',
            onClick: async () => {
              await updateMergeRequest({
                id: mergeRequestItems?.entities[firstElement]?.mergeRequest?.id,
                type: 'feStatus',
                status: { shortCode: MergeStatus.MERGED },
              });
              modalHooks.onClose();
            },
          },
        });
      case ChangeStatusButtonType.BE:
        return (config = {
          ...commonModalConfig,
          modalTitle: 'Are you sure to change BE task status ?',
          rightButtonProps: {
            props: { variant: 'solid', colorScheme: 'facebook' },
            isActive: true,
            title: 'Confirm',
            onClick: async () => {
              await updateMergeRequest({
                id: mergeRequestItems?.entities[firstElement]?.mergeRequest?.id,
                type: 'beStatus',
                status: { shortCode: MergeStatus.MERGED },
              });
              modalHooks.onClose();
            },
          },
        });
      case ChangeStatusButtonType.OM:
        return (config = {
          ...commonModalConfig,
          modalTitle: 'Are you sure to Change OM task status ?',
          rightButtonProps: {
            props: { variant: 'solid', colorScheme: 'facebook' },
            isActive: true,
            title: 'Confirm',
            onClick: async () => {
              await updateMergeRequest({
                id: mergeRequestItems?.entities[firstElement]?.mergeRequest?.id,
                type: 'omStatus',
                status: { shortCode: MergeStatus.MERGED },
              });
              modalHooks.onClose();
            },
          },
        });
      default:
        return commonModalConfig;
    }
  };

  return (
    <>
      {mergeRequestItems && (
        <Flex
          direction="column"
          gap={5}
          flex={1}
          height="-webkit-fill-available"
        >
          <CustomModal
            isOpen={modalHooks.isOpen}
            onClose={modalHooks.onClose}
            closeOnOverlayClick={false}
            config={modalConfig}
          >
            {modalContent}
          </CustomModal>
          <Card
            direction={{ base: 'column', md: 'row' }}
            variant="outline"
            overflow="hidden"
            pl="10"
            pt="7"
            pb="7"
            w="100%"
          >
            <Flex alignItems="start" flexDirection="column" gap={3} width={300}>
              <Text size="md">
                Merge Request ID :{' '}
                {mergeRequestItems?.entities[firstElement]?.mergeRequest?.id}
              </Text>
              <Text size="md">
                Requested By :{' '}
                {mergeRequestItems?.entities[firstElement]?.mergeRequest?.email}
              </Text>
              <Text size="md">
                From :{' '}
                {
                  mergeRequestItems?.entities[firstElement]?.mergeRequest
                    ?.sourceEnvironment?.name
                }
              </Text>
              <Text size="md">
                To :{' '}
                {
                  mergeRequestItems?.entities[firstElement]?.mergeRequest
                    ?.targetEnvironment?.name
                }
              </Text>
              <Text size="md">Created Date : {cDate}</Text>
              <Text size="md">Last Updated Date : {uDate}</Text>
              <Text size="md" display={{ base: 'unset', lg: 'none' }}>
                Status :{' '}
                {
                  <Badge variant="outline" color="green">
                    {
                      mergeRequestItems?.entities[firstElement]?.mergeRequest
                        ?.status.name
                    }
                  </Badge>
                }
              </Text>
              <Button
                variant="solid"
                colorScheme="blue"
                isDisabled={isCompleteBtnDisabled}
                display={{ base: 'unset', lg: 'none' }}
              >
                Complete Merge Request
              </Button>
            </Flex>
            <Flex
              w="full"
              flexDirection="column"
              justifyContent="center"
              flex={1}
              pr={10}
              pl={10}
              gap={10}
              display={{ base: 'none', lg: 'flex' }}
            >
              <Flex>
                <Stepper
                  size="md"
                  index={activeStep}
                  w="full"
                  colorScheme="green"
                >
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>
                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                      </Box>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              </Flex>
              <Flex justifyContent="end">
                <Button
                  variant="solid"
                  colorScheme="blue"
                  isDisabled={isCompleteBtnDisabled}
                >
                  Complete Merge Request
                </Button>
              </Flex>
            </Flex>
          </Card>
          <Form form={form} layout="vertical">
            <Form.Item name="data">
              <Table
                onChange={() => {
                  data = [...data];
                  form.setFieldValue('data', data);
                }}
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 3 }}
                footer={() => (
                  <Flex gap={3} justifyContent="end">
                    <Button
                      type="submit"
                      id="fe-submit"
                      onClick={onSubmitClick}
                    >
                      Change FE Tasks Status
                    </Button>
                    <Button
                      type="submit"
                      id="be-submit"
                      onClick={onSubmitClick}
                    >
                      Change BE Tasks Status
                    </Button>
                    <Button
                      type="submit"
                      id="om-submit"
                      onClick={onSubmitClick}
                    >
                      Change OM Tasks Status
                    </Button>
                  </Flex>
                )}
              />
            </Form.Item>
          </Form>
        </Flex>
      )}
    </>
  );
}

export default MergeRequestDetail;
