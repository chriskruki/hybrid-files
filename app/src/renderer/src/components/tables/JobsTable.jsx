import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function JobsTable({ jobList, dropdownElems }) {
  const mainRow = (row) => (
    <Fragment>
      <StyledTableCell>{row.job_id}</StyledTableCell>
      <StyledTableCell>{row.name}</StyledTableCell>
      <StyledTableCell>{row.type}</StyledTableCell>
      <StyledTableCell>{row.status}</StyledTableCell>
      <StyledTableCell>{row.src_path}</StyledTableCell>
      <StyledTableCell>{row.src_platform}</StyledTableCell>
      <StyledTableCell>{row.dest_path}</StyledTableCell>
      <StyledTableCell>{row.dest_platform}</StyledTableCell>
      <StyledTableCell>{row.date_created}</StyledTableCell>
      <StyledTableCell>{row.date_started}</StyledTableCell>
      <StyledTableCell>{row.date_finished}</StyledTableCell>
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
    jobList && jobList.map((row) => <HyRow key={row.user_id} row={row} mainRow={mainRow} />)
  return <HyTable dataList={jobList} header={tableHeader} body={tableBody} />
}
