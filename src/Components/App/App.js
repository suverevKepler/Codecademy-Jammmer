import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import React, { Component } from 'react';
import Spotify from '../../util/Spotify';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Seregin',
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      const newTracks = tracks.filter((trackToRemove) => trackToRemove.id !== track.id);
      this.setState({ playlistTracks: newTracks });
    }
  }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
      });
    });
  }
  search(term) {
    console.log(term);
    Spotify.search(term).then((searchResults) => {
      console.log('SEARCHED');
      this.setState({ searchResults: searchResults });
    });
  }
  render() {
    return (
      <div>
        <h1>
          JaAAAAA<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}
