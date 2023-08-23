'use client';

import type { InputRef } from 'antd';
import { Button, Input, Popover, Space, Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Flex, FormControl, FormLabel, SlideFade } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { Project } from '../../models/project';

import { MergeRequest } from '../../models/merge-request';
import {
  projectApiSlice,
  selectAllProjects,
  useGetAllProjectsQuery,
} from '../../store/slices/api/projectApiSlice';
import store, { RootState } from '../../store/store';
import {
  mergeRequestApiSlice,
  useGetAllMergeRequestsQuery,
} from '../../store/slices/api/mergeRequestApiSlice';
import { getBadge, obtainMergeRequestTable } from '../../utils/common';
import { useNavigate } from 'react-router-dom';
import MergeRequestStatuses from '../../components/merge-request-statuses/merge-request-statuses';
import { MergeStatus } from '../../utils/shortCodes';
import { setCurrentPoroject } from '../../store/slices/other/currentProjectSlice';
import { useSelector } from 'react-redux';

/* eslint-disable-next-line */
export interface DashboardProps {}

export function Dashboard(props: DashboardProps) {
  const navigate = useNavigate();
  const convertedProject: Project.ProjectOption[] = [];
  const [searchText, setSearchText] = useState('');
  const [dataTableData, setDataTableData] = useState<
    MergeRequest.MergeRequestDataTable[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchedColumn, setSearchedColumn] = useState('');
  const currentProject = useSelector(
    (state: RootState) => state.currentProject
  );

  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof MergeRequest.MergeRequestDataTable;
  const pageLimit = 5;

  const { data: projects } = useGetAllProjectsQuery();

  const { data: mergeRequests } = useGetAllMergeRequestsQuery({
    projectName: currentProject?.value,
    limit: pageLimit,
    page: currentPage,
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<MergeRequest.MergeRequestDataTable> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined rev={null} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        rev={null}
        style={{ color: filtered ? '#1677ff' : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<MergeRequest.MergeRequestDataTable> = [
    {
      title: 'Merge Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      ...getColumnSearchProps('requestedBy'),
    },
    {
      title: 'Requested Date',
      dataIndex: 'requstedDate',
      key: 'requstedDate',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, mergeRequest) => (
        <Popover
          trigger={'hover'}
          placement="bottom"
          content={<MergeRequestStatuses></MergeRequestStatuses>}
        >
          {getBadge(mergeRequest.status)}
        </Popover>
      ),
      filters: [
        { text: 'Merged', value: 'Merged' },
        { text: 'Waiting', value: 'Waiting' },
        { text: 'Uploaded', value: 'Uploaded' },
        { text: 'Deployed', value: 'Deployed' },
        { text: 'Deffered', value: 'Deffered' },
      ],
      onFilter: (value: string, record) => record.status.indexOf(value) === 0,
    },
    {
      title: 'Last Update Date',
      dataIndex: 'lastUpdatedDate',
      key: 'lastUpdatedDate',
    },
    {
      title: 'From',
      dataIndex: 'fromEnv',
      key: 'fromEnv',
      filters: [
        { text: 'Test-5', value: 'Test-5' },
        { text: 'Test-7', value: 'Test-7' },
        { text: 'MS-Int', value: 'MS-INT' },
        { text: 'MS-Acc', value: 'MS-ACC' },
      ],
      onFilter: (value: string, record) => record.fromEnv.indexOf(value) === 0,
    },
    {
      title: 'To',
      dataIndex: 'toEnv',
      key: 'toEnv',
      filters: [
        { text: 'Test-5', value: 'Test-5' },
        { text: 'Test-7', value: 'Test-7' },
        { text: 'MS-Int', value: 'MS-INT' },
        { text: 'MS-Acc', value: 'MS-ACC' },
      ],
      onFilter: (value: string, record) => record.toEnv.indexOf(value) === 0,
    },
    {
      title: '',
      dataIndex: 'showDetail',
      key: 'showDetail',
      align: 'center',
      render: (text, record, index) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/mergerequestdetail/${record.id}`, { replace: true });
          }}
        >
          Show
        </Button>
      ),
    },
    {
      title: '',
      dataIndex: 'addMergeReq',
      key: 'addMergeReq',
      align: 'center',
      render: (text, record, index) => (
        <Button
          type="primary"
          disabled={record?.status.toUpperCase() === MergeStatus.COMPLETED}
        >
          Add Task
        </Button>
      ),
    },
  ];

  Object.values(projects?.entities).forEach((item: Project.Project) => {
    convertedProject?.push({ label: item.key, value: item.key });
  });

  const fetchData = useCallback(async () => {
    await store.dispatch(
      mergeRequestApiSlice.endpoints.getAllMergeRequests.initiate({
        projectName: currentProject?.value,
        page: currentPage,
        limit: pageLimit,
      })
    );
  }, [currentPage, currentProject?.value]);

  useEffect(() => {
    if (currentProject?.value) {
      fetchData();

      setDataTableData(
        obtainMergeRequestTable(
          mergeRequests?.entities[mergeRequests?.ids[0]]?.entities
        )
      );
    }
  }, [currentProject, mergeRequests?.ids, mergeRequests?.entities, fetchData]);

  const handleChange = (event: Project.ProjectOption) => {
    store.dispatch(setCurrentPoroject(event));
  };

  return (
    <SlideFade in={true} style={{ width: '100%', height: '100%' }}>
      <Flex
        as="main"
        w="full"
        h="full"
        bg="white"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        borderRadius="3xl"
        overflow={'auto'}
      >
        <FormControl p={4} zIndex={9999}>
          <FormLabel>Please Select Project</FormLabel>
          <Select
            name="projects"
            options={convertedProject}
            placeholder="Select a project"
            value={currentProject}
            onChange={handleChange}
          />
        </FormControl>
        <Table
          columns={columns}
          dataSource={dataTableData}
          pagination={{
            pageSize:
              mergeRequests?.entities[mergeRequests.ids[0]]?.pageInformation
                ?.entities[1]?.take,
            current: currentPage,
            total:
              mergeRequests?.entities[mergeRequests.ids[0]]?.pageInformation
                ?.entities[1]?.total,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
            },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </Flex>
    </SlideFade>
  );
}

export async function loader(): Promise<null> {
  await store.dispatch(projectApiSlice.endpoints.getAllProjects.initiate());
  return null;
}
