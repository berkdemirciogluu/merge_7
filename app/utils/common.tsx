import { json } from 'react-router-dom';
import { MergeRequest } from '../models/merge-request';
import { Dictionary } from '@reduxjs/toolkit';
import { Tag } from 'antd';

export function errorHandler(response: Response) {
  if (!response.ok)
    throw json({ message: 'response.body', status: response.status });
}

export function obtainMergeRequestTable(
  data: Dictionary<MergeRequest.Item>
): MergeRequest.MergeRequestDataTable[] {
  let resultArray: MergeRequest.MergeRequestDataTable[] = [];
  const resultObject: MergeRequest.MergeRequestDataTable = {};
  if (data) {
    Object.values(data).forEach((item) => {
      resultObject.id = item.id;
      resultObject.lastUpdatedDate = formatDate(item.udate);
      resultObject.requstedDate = formatDate(item.cdate);
      resultObject.fromEnv = item.sourceEnvironment.name;
      resultObject.toEnv = item.targetEnvironment.name;
      resultObject.requestedBy = item.email;
      resultObject.status = item.status.name;
      resultArray = [...resultArray, { ...resultObject }];
    });
  }
  return resultArray;
}

export function getBadge(status: string): JSX.Element {
  let color: string;
  switch (status.toLowerCase()) {
    case 'merged':
      color = 'green';
      break;
    case 'open':
      color = 'default';
      break;
    case 'waiting':
      color = 'processing';
      break;
    case 'uploaded':
      color = 'purple';
      break;
    case 'completed':
      color = 'orange';
      break;
    case 'deferred':
      color = 'red';
      break;
    default:
      color = 'default';
      break;
  }
  return <Tag color={color}>{status.toUpperCase()}</Tag>;
}

export function formatDate(date: string): string {
  return `${new Date(date).toLocaleDateString()} ${new Date(
    date
  ).getUTCHours()}:${new Date(date).getUTCMinutes()}`;
}

export function obtainMergeRequestItemsTable(
  data: Dictionary<MergeRequest.GetMergeRequestItemsResponse>
): MergeRequest.MergeRequestItemsDataTable[] {
  let resultArray: MergeRequest.MergeRequestItemsDataTable[] = [];
  const resultObject: MergeRequest.MergeRequestItemsDataTable = {};
  if (data) {
    Object.values(data).forEach((item) => {
      resultObject.key = item.id;
      resultObject.taskName = item.taskName;
      resultObject.feStatus = item.feStatus.name;
      resultObject.beStatus = item.beStatus.name;
      resultObject.omStatus = item.omStatus.name;
      resultObject.feUser = item.feUser;
      resultObject.beUser = item.beUser;
      resultObject.omUser = item.omUser;
      resultArray = [...resultArray, { ...resultObject }];
    });
  }
  return resultArray;
}
