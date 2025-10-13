import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import './comics.css'

function GradedComicsTable() {
	type GradedComic = {
		title: string
		issue: number
		grade: string
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

	const tableColumns: GridColDef[] = [
		{
			field: 'title',
			headerName: 'Title'
		},
		{
			field: 'issue',
			headerName: 'Issue'
		},
		{
			field: 'grade',
			headerName: 'Grade'
		},
		{
			field: 'page_quality',
			headerName: 'Page Quality'
		},
		{
			field: 'grader',
			headerName: 'Grader'
		},
		{
			field: 'cert_number',
			headerName: 'Cert Number'
		},
		{
			field: 'publisher',
			headerName: 'Publisher'
		},
		{
			field: 'published_month',
			headerName: 'Month'
		},
		{
			field: 'published_year',
			headerName: 'Year'
		},
		{
			field: 'variant',
			headerName: 'Variant'
		},
		{
			field: 'key_notes',
			headerName: 'Key Notes'
		},
		{
			field: 'signed_by',
			headerName: 'Signed By'
		}
	]

	const [tableData, setData] = useState<GradedComic[]>()
	const [tableError, setError] = useState<String>('')
	const [tableLoading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					'http://localhost:3000/comics/graded'
				)
				if (!response.ok) {
					throw new Error(`${response.status}`)
				}
				const jsonData = await response.json()
				setData(jsonData)
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
