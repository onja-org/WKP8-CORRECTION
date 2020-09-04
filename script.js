let songs = [];

const songsList = document.querySelector('.song-list-container');
const addSongForm = document.querySelector('.add-songs');
const filterTitleInput = document.querySelector('#filter-title');
const filterStyleInput = document.querySelector('#filter-style');
const filterForm = document.querySelector('.filter-songs');
const resetFiltersBtn = document.querySelector('.reset-filters');

const filterList = e => {
	showSongs(e, filterTitleInput.value, filterStyleInput.value);
};

const resetFilters = e => {
	filterForm.reset();
	showSongs();
};

const showSongs = (event, filterTitle, filterStyle) => {
	let sortedSongs = songs.sort((song1, song2) => song2.score - song1.score);

	// DO THE FILTERING HERE
	if (filterTitle) {
		sortedSongs = sortedSongs.filter(song => {
			let lowerCaseTitle = song.title.toLowerCase();
			// jerusalem
			let lowerCaseFilter = filterTitle.toLowerCase();
			// jeru
			if (lowerCaseTitle.includes(lowerCaseFilter)) {
				return true;
			} else {
				return false;
			}
		});
	}

	if (filterStyle) {
		sortedSongs = sortedSongs.filter(song => song.style === filterStyle);
	}

	const html = sortedSongs
		.map(
			song => `
		<article class="song">
			<section>
				<img src="${song.picture}" alt="${song.artist}" />
			</section>
			<section>
				<h5>${song.title}</h5>
				<p>${song.style}</p>
			</section>
			<section>
				<h5>${song.artist}</h5>
				<p>${song.length}</p>
			</section>
			<section>
				SCORE: ${song.score}
			</section>
			<section class="buttons">
				<button data-id="${song.id}" 
					aria-label="Increment score of ${song.title}" 
					class="increment-score">+1
				</button>
				<button data-id="${song.id}" 
					aria-label="Increment score of ${song.title}" 
					class="delete">
					<img src="./assets/icons/trash.svg" alt="Delete Song" />
				</button>
			</section>
		</article>            
			`
		)
		.join('');
	songsList.innerHTML = html;
};

const addSong = e => {
	e.preventDefault();
	const form = e.target;
	// USE SANITIZE
	const newSong = {
		title: form.title.value,
		artist: form.artist.value,
		style: form.style.value,
		length: form.length.value,
		picture: form.picture.value,
		id: Date.now(),
		score: 0,
	};
	songs.push(newSong);
	form.reset();
	songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'));
};

// event delegation for update and delete song buttons
const handleClick = e => {
	if (e.target.closest('button.increment-score')) {
		const button = e.target.closest('button.increment-score');
		const id = button.dataset.id;
		updateSong(Number(id));
	}
	if (e.target.closest('button.delete')) {
		const button = e.target.closest('button.delete');
		const id = button.dataset.id;
		console.log(id);
		deleteSong(Number(id));
	}
};

const updateSong = idFromTheButton => {
	// grab the correct element to update (with its id)
	const song = songs.find(song => song.id === idFromTheButton);
	song.score++;
	songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'));
};

const deleteSong = idToDelete => {
	console.log(idToDelete);
	songs = songs.filter(song => song.id !== idToDelete);
	console.log(songs);
	songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'));
};

// when we reload, we want to look inside the local storage and put them into songs
const initLocalStorage = () => {
	const stringFromLS = localStorage.getItem('songs');
	const lsItems = JSON.parse(stringFromLS);
	console.log(lsItems);
	if (lsItems) {
		songs = lsItems;
	} else {
		songs = [];
	}
	songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'));
};

// we want to update the local storage each time we update, delete or add an attirbute
const updateLocalStorage = () => {
	localStorage.setItem('songs', JSON.stringify(songs));
};

resetFiltersBtn.addEventListener('click', resetFilters);
filterTitleInput.addEventListener('keyup', filterList);
filterStyleInput.addEventListener('change', filterList);
addSongForm.addEventListener('submit', addSong);
songsList.addEventListener('pleaseUpdateTheList', showSongs);
songsList.addEventListener('pleaseUpdateTheList', updateLocalStorage);
songsList.addEventListener('click', handleClick);

initLocalStorage();
