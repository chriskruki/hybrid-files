import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function PlatformsTable({ platformList, dropdownElems }) {
  const tableHeader = (
    <StyledTableRow>
      {/* <StyledTableCell /> */}
      <StyledTableCell>ID</StyledTableCell>
      <StyledTableCell>Name</StyledTableCell>
      <StyledTableCell>Type</StyledTableCell>
      <StyledTableCell>Schema</StyledTableCell>
      <StyledTableCell>Status</StyledTableCell>
      <StyledTableCell></StyledTableCell>
    </StyledTableRow>
  )

  const mainBody = (row) => (
    <Fragment>
      <StyledTableCell component="th" scope="row">
        {row.platform_id}
      </StyledTableCell>
      <StyledTableCell>{row.name}</StyledTableCell>
      <StyledTableCell>{row.type}</StyledTableCell>
      <StyledTableCell>{row.schema}</StyledTableCell>
      <StyledTableCell>{row.status}</StyledTableCell>
      <StyledTableCell sx={{ width: '75px' }}>{dropdownElems(row)}</StyledTableCell>
    </Fragment>
  )

  const tableBody = platformList.map((row) => (
    <HyRow key={row.platform_id} row={row} mainBody={mainBody} />
  ))

  return <HyTable dataList={platformList} header={tableHeader} body={tableBody} />
}
