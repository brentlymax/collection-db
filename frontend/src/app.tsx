import { useEffect, useLayoutEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import About from './pages/about'
import Art from './pages/art'
import Comics from './pages/comics'
import Contact from './pages/contact'
import Home from './pages/home'
import Magic from './pages/magic'
import './app.css'

type Theme = 'light' | 'dark'

const themeAccents: Record<Theme, string> = {
	dark: '#7aff5c',
	light: '#c04ad3'
}

const muiThemes = {
	dark: createTheme({
		palette: {
			mode: 'dark',
			primary: { main: themeAccents.dark },
			background: { default: '#18201d', paper: '#202925' },
			text: { primary: '#f4efe4', secondary: '#bdc8c2' },
			divider: '#46524c'
		}
	}),
	light: createTheme({
		palette: {
			mode: 'light',
			primary: { main: themeAccents.light },
			background: { default: '#f4efe4', paper: '#fffdf7' },
			text: { primary: '#25312c', secondary: '#59635e' },
			divider: '#c9c1b1'
		}
	})
}

function getPreferredTheme(): Theme {
	const savedTheme = localStorage.getItem('theme')

	if (savedTheme === 'light' || savedTheme === 'dark') {
		return savedTheme
	}

	return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function App() {
	const [theme, setTheme] = useState<Theme>(getPreferredTheme)

	useLayoutEffect(() => {
		document.documentElement.style.setProperty('--accent-color', themeAccents[theme])
	}, [theme])

	useEffect(() => {
		document.documentElement.dataset.theme = theme
		document.documentElement.style.colorScheme = theme
	}, [theme])

	useEffect(() => {
		const colorScheme = window.matchMedia('(prefers-color-scheme: light)')
		const followDeviceTheme = (event: MediaQueryListEvent) => {
			if (!localStorage.getItem('theme')) {
				setTheme(event.matches ? 'light' : 'dark')
			}
		}

		colorScheme.addEventListener('change', followDeviceTheme)
		return () => colorScheme.removeEventListener('change', followDeviceTheme)
	}, [])

	const toggleTheme = () => {
		setTheme((currentTheme) => {
			const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
			localStorage.setItem('theme', nextTheme)
			return nextTheme
		})
	}

	const nextTheme = theme === 'dark' ? 'light' : 'dark'

	return (
		<ThemeProvider theme={muiThemes[theme]}>
			<BrowserRouter>
			<div className='navigation-wrapper'>
				<nav className='navigation-bar'>
					<div className='navigation-links'>
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
					</div>
					<button
						className='theme-toggle'
						type='button'
						onClick={toggleTheme}
						aria-label={`Switch to ${nextTheme} mode`}
						title={`Switch to ${nextTheme} mode`}
					>
						{theme === 'dark' ? <Sun aria-hidden='true' /> : <Moon aria-hidden='true' />}
					</button>
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
				</Routes>
			</div>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
