export const PAGES = {
  LOGIN: 0,
  FILES: 1,
  JOBS: 2,
  PLATFORMS: 3,
  USERS: 4,
  GROUPS: 5,
}

export const NAVBTNS = [
  { label: 'Files', page: PAGES.FILES },
  { label: 'Jobs', page: PAGES.JOBS },
  { label: 'Platforms', page: PAGES.PLATFORMS },
  { label: 'Users', page: PAGES.USERS },
  { label: 'Groups', page: PAGES.GROUPS }
]

export const INIT_PLATFORM = {
  platform_id: -1,
  name: '',
  type: '',
  schema: '',
  status: '',
  auth_id: '',
  auth_pass: '',
  reqMsg: '',
  reqInProg: false,
  reqSuccess: false
}

export const INIT_USER = {
  user_id: -1,
  username: '',
  password: ''
}

export const INIT_GROUP = {
  group_id: -1,
  name: '',
  description: ''
}

export const IMAGE_TYPES = [
  '.png',
  '.jpg',
  '.jpeg'
]

export const VIDEO_TYPES = [
  '.mp4',
  '.avi',
  '.mov',
  '.mts'
]

export const MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES]

export const INIT_JOB = {
  job_id: -1,
  job_group: -1,
  name: '',
  type: '',
  status: '',
  src_path: '',
  dest_path: '',
  src_platform: '',
  dest_platform: '',
  fileTypes: MEDIA_TYPES,
  dirRecursive: false,
  fileList: []
}


export const INIT_TABLE_CONFIG = {
  page: 1,
  rows: 20,
  totalRows: -1,
  isChanged: false,
  filterName: '',
  filterExtension: '',
  date_created_start: '',
  date_created_end: '',
}
