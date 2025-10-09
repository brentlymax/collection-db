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
			<nav style={{ display: 'flex', gap: '10px' }}>
				<Link to='/'>Home</Link>
				<Link to='/about'>About</Link>
				<Link to='/art'>Art</Link>
				<Link to='/comics'>Comics</Link>
				<Link to='/contact'>Contact</Link>
				<Link to='/magic'>Magic</Link>
				<Link to='/pokemon'>Pokemon</Link>
			</nav>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/art' element={<Art />} />
				<Route path='/comics' element={<Comics />} />
				<Route path='/contact' element={<Contact />} />
				<Route path='/magic' element={<Magic />} />
				<Route path='/pokemon' element={<Pokemon />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
