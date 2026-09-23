import './home.css'

function Home() {
	return (
		<main className='home'>
			<div className='home-image-wrap'>
				<img
					className='home-image'
					src='https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1800&q=85'
					alt='A colorful collection of comic books'
				/>
			</div>

			<header className='home-intro'>
				<p className='home-eyebrow'>Curated and collected</p>
				<h1>
					B-Man's
					<br />
					Collection
				</h1>
				<p className='home-subheader'>A catalogue of collectibles</p>
			</header>
		</main>
	)
}

export default Home
