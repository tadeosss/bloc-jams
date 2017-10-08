// creates variable setSong equal to function declaration with parameter songNumber
var setSong = function(songNumber) {
	//currentlyPlayingSongNumber is equal to the parameter songNumber that is parsed as an integer
	currentlyPlayingSongNumber = parseInt(songNumber);
	//currentSongFromAlbum is equal to the songs in the currentAlbum object that has an index of songNumber - 1
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}

// Example
//  var currentAlbum = {
// 	foo: 'bar',
// 	songs: [
// 		{title: 'fjldkjfla', duration: 435763},
// 		{title: 'fjldkjfla', duration: 435763},
// 		{title: 'fjldkjfla', duration: 435763},
// 		{title: 'fjldkjfla', duration: 435763},
// 		{title: 'fjldkjfla', duration: 435763},
// 	]
// }

//creates variable called getSongNumberCell to equal function declaration with parameter of number
var getSongNumberCell = function(number) {
	//function returns the song-item-number class that has the data-song-number with appended number of the song
	return $('.song-item-number[data-song-number="' + number + '"]');
};

// Function to generate song row content that is stored in variable called createSongRow
var createSongRow = function(songNumber, songName, songLength) {
	//creates a variable called template
	var template =
	//a template for a song row is created using the following that consists of table rows and columns
	//a table row is classified as a class called album-view-song-item
		'<tr class="album-view-song-item">'
		//a table cell is classified as a class called song-item-number, data-song-number class(?) is equals to the songNumber variable, appends the songNumber variable, appends closing tag
	+ '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	  //a table cell is classified as a class called song-item-title, appends and calls the songName, appends closing tag
	+ '  <td class="song-item-title">' + songName + '</td>'
	  //a table cell is classified as a class called song-item-duration, appends and calls the songLength variable, appends closing tag
	+ '  <td class="song-item-duration">' + songLength + '</td>'
	//closing tag for table row
	+ '</tr>'
	;
  //creates a variable in JQuery library called row that is equal to a parameter that calls the variable template
	var $row = $(template);

  //creates a function that can take parameters that is stored in variable called clickHandler
	var clickHandler = function() {
		//attribute called data-song-number is passed in as parameter(s) that is parsed as integer which is stored into a variable called songNumber
		//what is 'this' referring to?
		var songNumber = parseInt($(this).attr('data-song-number'));
		//if statement referring to the setSong function, if setSong is not null or empty
		if (setSong !== null) {
			// Revert to song number for currently playing song because user started playing new song.
			var currentlyPlayingCell = getSongNumberCell(setSong);
			currentlyPlayingCell.html(setSong);
		}
		if (setSong !== songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing.
			$(this).html(pauseButtonTemplate);
			setSong(songNumber)
			updatePlayerBarSong();
		} else if (setSong === songNumber) {
			// Switch from Pause -> Play button to pause currently playing song.
			$(this).html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
			setSong = null;
    	currentSongFromAlbum = null;
		}
	};

  var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== setSong) {
          songNumberCell.html(playButtonTemplate);
      }
  };

  var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== setSong) {
          songNumberCell.html(songNumber);
      }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
	//it returns the song row template
  return $row;
};

//a function declaration called setCurrentAlbum that takes a parameter called album
var setCurrentAlbum = function(album) {
	currentAlbum = album;
	// Select all HTML elements to display album page
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

	// firstchild = first child node of element; nodeValue = sets value of node
	$albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

	// clear album song list HTML to empty string
	$albumSongList.empty();

	// go through all songs from album obj and insert them into HTML using innerHTML
	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
	}
};

var trackIndex = function(album, song) {
   return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	// Note that we're _incrementing_ the song here
	currentSongIndex++;

	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}

	// Save the last song number before changing it
	var lastSongNumber = setSong;

	// Set a new current song
	setSong = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	// Update the Player Bar information
	updatePlayerBarSong();

	var $nextSongNumberCell = getSongNumberCell(setSong);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = setSong;

    // Set a new current song
    setSong = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(setSong);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var setSong = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	$previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
