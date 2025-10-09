import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import About from './pages/about'
import Art from './pages/art'
import Comics from './pages/comics'
import Contact from './pages/contact'
import Home from './pages/home'
import Magic from './pages/magic'
import Pokemon from './pages/pokemon'
import './app.css'

function App() {
	return (
		<BrowserRouter>
			<div className='navigation-wrapper'>
				<nav className='navigation-bar'>
					<Link className='navigation-link' to='/'>
						Home
					</Link>
					<Link className='navigation-link' to='/about'>
						About
					</Link>
					<Link className='navigation-link' to='/art'>
						Art
					</Link>
					<Link className='navigation-link' to='/comics'>
						Comics
					</Link>
					<Link className='navigation-link' to='/contact'>
						Contact
					</Link>
					<Link className='navigation-link' to='/magic'>
						Magic
					</Link>
					<Link className='navigation-link' to='/pokemon'>
						Pokemon
					</Link>
				</nav>
			</div>

			<div className='routes-wrapper'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/about' element={<About />} />
					<Route path='/art' element={<Art />} />
					<Route path='/comics' element={<Comics />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='/magic' element={<Magic />} />
					<Route path='/pokemon' element={<Pokemon />} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
