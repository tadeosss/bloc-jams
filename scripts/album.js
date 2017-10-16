// creates variable setSong equal to function declaration with parameter songNumber
var setSong = function(songNumber) {
	//to prevent concurrent playback; stop current song before playing a new one
	if (currentSoundFile) {
		currentSoundFile.stop();
	}
	//currentlyPlayingSongNumber is equal to the parameter songNumber that is parsed as an integer
	currentlyPlayingSongNumber = parseInt(songNumber);
	//currentSongFromAlbum is equal to the songs in the currentAlbum object that has an index of songNumber - 1
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	//assign a new buzz sound object; pass the audio file via audioUrl property from currentSongFromAlbum object
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: [ 'mp3'], //property of the object with settings of acceptable audio formats as an array
		preload: true //property of the object with settings that allows Buzz to load the mp3s as soon as the page loads
	});

	setVolume(currentVolume);
};

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};
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
	return $('.song-item-number[data-song-number="' + number + '"]');  //'.song-item-number[data-song-number="4"]'
};

// Function to generate song row content that is stored in variable called createSongRow
var createSongRow = function(songNumber, songName, songLength) {
	//the function above creates a variable called template where it assigns static song row template
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
		//'this' refers to the current song number
		var songNumber = parseInt($(this).attr('data-song-number'));
		//conditional statement referring to the setSong function, if setSong is not null or empty then perform action on the block of code within
		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song.
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing.
			setSong(songNumber);
			currentSoundFile.play(); //implement play behavior
			$(this).html(pauseButtonTemplate);
			currentlyPlayingSongNumber = songNumber;
			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
			updatePlayerBarSong();
		} else if (currentlyPlayingSongNumber === songNumber) {
			if (currentSoundFile.isPaused()) { //conditional to check if current sound file is paused
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton); //revert icon in song row and player bar to the pause button
				currentSoundFile.play(); //start playing song again
			} else { //if it is not paused
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton); //set content of the song number cell and player bar's pause button back to play button
				currentSoundFile.pause(); //pause the song
			}
		}
	};
	//creates a function that is stored in variable called 'onHover' that takes parameter called event
  var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(playButtonTemplate);
      }
  };
	//creates a function that is stored in variable called 'offHover' that takes in parameter called event
  var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
      }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
	//it returns the song row template (to where?)
  return $row;
};

//a function declaration called setCurrentAlbum that takes a parameter called album
var setCurrentAlbum = function(album) {
	currentAlbum = album;
	// Select all HTML elements to display album page
	//stores the value of album view title to variable called albumTitle
	var $albumTitle = $('.album-view-title');
	//stores the value of album view artist to variable called albumArtist
	var $albumArtist = $('.album-view-artist');
	//stores the value of album view release info to variable called albumReleaseInfo
  var $albumReleaseInfo = $('.album-view-release-info');
	//stores the value of album cover art to variable called albumImage
  var $albumImage = $('.album-cover-art');
	//stores the value of album view song list to variable called albumSongList
  var $albumSongList = $('.album-view-song-list');

	// firstchild = first child node of element; nodeValue = sets value of node
	//converts classes into texts (string values?)
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
//function that takens in two parameters called album and song, stored in variable called trackIndex
var trackIndex = function(album, song) {
	//the block returns the index of the song parameter from the song in the album
   return album.songs.indexOf(song);
};
//function that takes parameter(s) that is stored into a variable called updatePlayerBarSong
var updatePlayerBarSong = function() {
		//passes in parameters and converts them into string?
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
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
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
    setSong(currentSongIndex + 1);
		currentSoundFile.play();
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

// Global variables to store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null; //used to store the sound object when a new current song is set
var currentVolume = 80; //used to handle methods for volume with set initial value to 80
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	$previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
