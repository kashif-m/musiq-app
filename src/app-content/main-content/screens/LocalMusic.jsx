
import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import DefaultCover from '../../../assets/images/defaultcover.svg'

export default class LocalMusic extends Component {

	constructor(props) {
		super(props)

		const {metadata} = props
		this.state = {
			selection: 'all'
		}
	}

	renderHeader = () => {
		
		const {selection} = this.state

		return (
			<div className="header">
				<div className={`option${selection === 'all' ? ' selected' : '' }`}
					onClick={() => this.setState({selection: 'all'})} >All</div>
				<div className={`option${selection === 'albums' ? ' selected' : '' }`}
					onClick={() => this.setState({selection: 'albums'})} >Albums</div>
				<div className={`option${selection === 'artists' ? ' selected' : '' }`}
					onClick={() => this.setState({selection: 'artists'})} >Artists</div>
			</div>
		)
	}

	renderAllSongs = () => {

		const {metadata} = this.props
		const [playingNow, updatePlayingNow] = this.props.playingNow

		return (
			<div className="all">
				{
					metadata.map(song => {
					
						const {artist, title, picture} = song.common
						const url = picture ? picture[0].url : false
						return (
							<div className="song" key={title} >
								{
									url ?
									<img src={url} alt="i" className='cover'
										onClick={() => updatePlayingNow(song)} />
									: <SVG src={DefaultCover} className='cover'
											onClick={() => updatePlayingNow(song)} />
								}
								<div className="title"
									onClick={() => updatePlayingNow(song)} >{title}</div>
								<div className="artist">{artist}</div>
								<div className="album"></div>
							</div>)
					})
				}
			</div>
		)
	}

	renderArtists = () => {

		return (
			<div className="artists">
				
			</div>
		)
	}

	renderAlbums = () => {

		return (
			<div className="albums">
				
			</div>
		)
	}

	render() {

		const {selection} = this.state
		const {metadata} = this.props

		return (
			<div className="local-music">
				<div className="heading">Local Music</div>
				{
					metadata && metadata.length > 0 ?
					<React.Fragment>
						{this.renderHeader()}
						{
							(selection === 'all' ? this.renderAllSongs()
							: selection === 'artists' ? this.renderArtists()
							: selection === 'albums' ? this.renderAlbums()
							: null)
						}
					</React.Fragment>
					: <div className="empty">
					{
						!metadata ?
						'Loading . . .'
						: 'No music found'
					}
				</div>
				}
				
			</div>
		)
	}
}
