import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import './comics.css'

const tableColumns: GridColDef[] = [
	{
		field: 'title',
		headerName: 'Title',
		width: 260,
		minWidth: 160
	},
	{
		field: 'issue',
		headerName: 'Issue',
		width: 80,
		minWidth: 70
	},
	{
		field: 'grade',
		headerName: 'Grade',
		width: 90,
		minWidth: 80
	},
	{
		field: 'page_quality',
		headerName: 'Page Quality',
		width: 150,
		minWidth: 130
	},
	{
		field: 'grader',
		headerName: 'Grader',
		width: 100,
		minWidth: 90
	},
	{
		field: 'cert_number',
		headerName: 'Cert Number',
		width: 180,
		minWidth: 140
	},
	{
		field: 'publisher',
		headerName: 'Publisher',
		width: 180,
		minWidth: 120
	},
	{
		field: 'published_month',
		headerName: 'Month',
		width: 100,
		minWidth: 90
	},
	{
		field: 'published_year',
		headerName: 'Year',
		width: 90,
		minWidth: 80
	},
	{
		field: 'variant',
		headerName: 'Variant',
		width: 240,
		minWidth: 140
	},
	{
		field: 'key_notes',
		headerName: 'Key Notes',
		width: 400,
		minWidth: 180
	},
	{
		field: 'signed_by',
		headerName: 'Signed By',
		width: 200,
		minWidth: 120
	}
]

function GradedComicsTable() {
	type GradedComic = {
		title: string
		issue: string
		grade: string | null
		page_quality: string
		grader: string
		cert_number: string
		publisher: string
		published_month: number | null
		published_year: number | null
		variant: string | null
		key_notes: string | null
		signed_by: string | null
	}

	const [tableData, setData] = useState<GradedComic[]>()
	const [tableError, setError] = useState<string>('')
	const [tableLoading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					'/api/comics/graded'
				)
				if (!response.ok) {
					throw new Error(`${response.status}`)
				}
				const jsonData: GradedComic[] = await response.json()

				// Presorting: title asc, issue asc, grade dsc
				setData([...jsonData].sort((first, second) =>
					first.title.localeCompare(second.title) ||
					first.issue.localeCompare(second.issue, undefined, { numeric: true }) ||
					(second.grade ?? '').localeCompare(first.grade ?? '', undefined, { numeric: true })
				))
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError('Error response: ' + error.message)
				} else if (typeof error === 'string') {
					setError('String error: ' + error)
				} else {
					setError('Unknown error: ' + error)
				}
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (tableError) {
		return <h2 className='table-error'>{tableError}</h2>
	}

	if (tableLoading) {
		return <h2 className='table-loading'>Loading...</h2>
	}

	return (
		<Box className='table-box'>
			<DataGrid
				columns={tableColumns}
				rows={tableData}
				getRowId={(row) => row.cert_number}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 10
						}
					}
				}}
				pageSizeOptions={[10, 25, 50, 100]}
				disableRowSelectionOnClick
				// checkboxSelection
			/>
		</Box>
	)
}

function Comics() {
	return <GradedComicsTable />
}

export default Comics
