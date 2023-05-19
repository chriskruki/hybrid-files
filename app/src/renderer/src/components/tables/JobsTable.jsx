import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function JobsTable({ jobList, dropdownElems }) {
  const mainBody = (row) => (
    <Fragment>
      <StyledTableCell>{row.job_id}</StyledTableCell>
      <StyledTableCell>{row.name}</StyledTableCell>
      <StyledTableCell>{row.type}</StyledTableCell>
      <StyledTableCell>{row.status}</StyledTableCell>
      <StyledTableCell>{String.raw`${row.src_path}`}</StyledTableCell>
      <StyledTableCell>{String.raw`${row.src_platform}`}</StyledTableCell>
      <StyledTableCell>{String.raw`${row.dest_path}`}</StyledTableCell>
      <StyledTableCell>{String.raw`${row.dest_platform}`}</StyledTableCell>
      <StyledTableCell>
        {new Date(row.date_created).toLocaleString('en-US', { timeZone: 'UTC' })}
      </StyledTableCell>
      <StyledTableCell>
        {new Date(row.date_started).toLocaleString('en-US', { timeZone: 'UTC' })}
      </StyledTableCell>
      <StyledTableCell>
        {new Date(row.date_finished).toLocaleString('en-US', { timeZone: 'UTC' })}
      </StyledTableCell>
      <StyledTableCell sx={{ width: '75px' }}>{dropdownElems(row)}</StyledTableCell>
    </Fragment>
  )

  const tableHeader = (
    <StyledTableRow>
      <StyledTableCell>ID</StyledTableCell>
      <StyledTableCell>Name</StyledTableCell>
      <StyledTableCell>Type</StyledTableCell>
      <StyledTableCell>Status</StyledTableCell>
      <StyledTableCell>Src Path</StyledTableCell>
      <StyledTableCell>Src Platform</StyledTableCell>
      <StyledTableCell>Dest Path</StyledTableCell>
      <StyledTableCell>Dest Platform</StyledTableCell>
      <StyledTableCell>Created</StyledTableCell>
      <StyledTableCell>Started</StyledTableCell>
      <StyledTableCell>Finished</StyledTableCell>
      <StyledTableCell></StyledTableCell>
    </StyledTableRow>
  )

  const tableBody =
    jobList && jobList.map((row) => <HyRow key={row.user_id} row={row} mainBody={mainBody} />)

  return <HyTable dataList={jobList} header={tableHeader} body={tableBody} />
}
