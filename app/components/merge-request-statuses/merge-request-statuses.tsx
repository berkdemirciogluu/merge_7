import { Space, Progress } from 'antd';
import styles from './merge-request-statuses.module.css';

/* eslint-disable-next-line */
export interface MergeRequestStatusesProps {}

export function MergeRequestStatuses(props: MergeRequestStatusesProps) {
  return (
    <Space wrap>
      <Progress type="circle" percent={75} size={50} />
      <Progress type="circle" percent={0} status="exception" size={'small'} />
      <Progress type="circle" percent={100} size={'small'} />
    </Space>
  );
}

export default MergeRequestStatuses;
