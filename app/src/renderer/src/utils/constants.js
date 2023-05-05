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