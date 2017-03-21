// Example Album
var albumPicasso = {
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{ title: 'Blue', duration: '4:26' },
		{ title: 'Green', duration: '3:14' },
		{ title: 'Red', duration: '5:01' },
		{ title: 'Pink', duration: '3:21'},
		{ title: 'Magenta', duration: '2:15'}
	]
};
 
// Another Example Album
var albumMarconi = {
	title: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{ title: 'Hello, Operator?', duration: '1:01' },
		{ title: 'Ring, ring, ring', duration: '5:01' },
		{ title: 'Fits in your pocket', duration: '3:21'},
		{ title: 'Can you hear me now?', duration: '3:14' },
		{ title: 'Wrong phone number', duration: '2:15'}
	]
};

// Third Album Object
var albumVirginia = {
	title: 'Sic Semper Tyrannis',
	artist: 'Old Dominion',
	label: 'VA',
	year: '1788',
	albumArtUrl: 'assets/images/album_covers/02.png',
	songs: [
		{ title: 'Pocahontas Smith', duration: '1:01' },
		{ title: 'Chesapeake', duration: '5:43' },
		{ title: 'Newport News', duration: '3:05'},
		{ title: 'Portsmouth', duration: '2:54' },
		{ title: 'Virginia Beach', duration: '3:45'}
	]
};

// Function to generate song row content
var createSongRow = function(songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
	+ '  <td class="song-item-number">' + songNumber + '</td>'
	+ '  <td class="song-item-title">' + songName + '</td>'
	+ '  <td class="song-item-duration">' + songLength + '</td>'
	+ '</tr>'
	;
 
	return template;
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
	// Assign values to each part of the album (text, images)
	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);
	
	// Clear contents of album song list container
	albumSongList.innerHTML = '';
	
	// Build list of songs from album JavaScript object
	for (var i = 0; i < album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	}
};
	
window.onload = function() {
	setCurrentAlbum(albumPicasso);
	
	var albums = [albumPicasso, albumMarconi, albumVirginia];
	var index = 0;
	
	albumImage.addEventListener("click", function(event) {
		setCurrentAlbum(albums[index]);
		index++;
		if (index == albums.length) {
			index = 0;
		}
	});
};