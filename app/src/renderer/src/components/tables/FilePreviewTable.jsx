import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function FilePreviewTable({ dataList }) {
  const tableHeader = (
    <StyledTableRow>
      <StyledTableCell>Relative Path</StyledTableCell>
      <StyledTableCell>Created</StyledTableCell>
    </StyledTableRow>
  )

  const mainRow = (row) => {
    const dateString = row.createdTime
    const dateObject = new Date(dateString)
    const formattedDate = dateObject.toLocaleString('en-US', { timeZone: 'UTC' })

    return (
      <Fragment>
        <StyledTableCell className='max-w-[500px] overflow-auto'>{row.relativePath}</StyledTableCell>
        <StyledTableCell>{formattedDate}</StyledTableCell>
      </Fragment>
    )
  }

  const tableBody = dataList.map((row, idx) => <HyRow key={idx} row={row} mainRow={mainRow} />)

  return <HyTable dataList={dataList} header={tableHeader} body={tableBody} />
}
