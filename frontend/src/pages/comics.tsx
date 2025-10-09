import { useEffect, useState } from 'react'

type GradedComic = {
	title: string
	issue: number
	grade: number
	page_qual: string
	grader: string
	cert_num: string
	publisher: string
	pub_month: number | null
	pub_year: number | null
	variant: string | null
	key_notes: string | null
	signed_by: string | null
}

function GradedComicTable() {
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
					setError(error.message)
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
		return <div>{tableError}</div>
	}

	if (tableLoading) {
		return <div>Table data loading...</div>
	}

	return (
		<div>
			{tableData ? (
				tableData.map((comic) => (
					<div key={comic.cert_num}>
						{comic.title} #{comic.issue}
					</div>
				))
			) : (
				<p>No table data available</p>
			)}
		</div>
	)
}

function Comics() {
	return <GradedComicTable />
}

export default Comics
