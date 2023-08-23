import { OptionBase } from 'chakra-react-select';

export namespace Project {
  export interface Project {
    expand: string;
    self: string;
    id: string;
    key: string;
    name: string;
    avatarUrls: AvatarUrl;
    projectCategory: ProjectCategory;
    projectTypeKey: string;
    archived: boolean;
  }

  export interface AvatarUrl {
    48_48: string;
    24_24: string;
    16_16: string;
    32_32: string;
  }

  export interface ProjectCategory {
    self: string;
    id: string;
    name: string;
    description: string;
  }

  export interface ProjectOption extends OptionBase {
    label: string;
    value: string;
  }
}
