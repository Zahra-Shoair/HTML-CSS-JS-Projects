const bookmarkNameInput = document.getElementById("bookmark-name");
const bookmarkUrlInput = document.getElementById("bookmark-url");
const addBookmarkBtn = document.getElementById("add-bookmark-btn");
const bookmarkList = document.getElementById("bookmark-list");

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

addBookmarkBtn.addEventListener("click", addBookmark);

function addBookmark(e) {
  e.preventDefault();

  const name = bookmarkNameInput.value;
  const url = bookmarkUrlInput.value;

  bookmarkNameInput.value = "";
  bookmarkUrlInput.value = "";

  updateBookmark(name, normalizeUrl(url));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  updateUi();
}

function updateBookmark(name, url) {
  const bookmarkObject = {
    id: Date.now(),
    name,
    url,
  };

  bookmarks.push(bookmarkObject);
}

function normalizeUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

function updateUi() {
  bookmarkList.innerHTML = "";
  bookmarks.forEach((bookmark) => createBookmarkEl(bookmark));
}

function createBookmarkEl(bookmark) {
  const listEl = document.createElement("li");
  listEl.innerHTML = `<a target="_blank" href="${bookmark.url}">${bookmark.name}</a><button onclick="removeBookmark(${bookmark.id})">Remove</button>`;
  bookmarkList.appendChild(listEl);
}

function removeBookmark(listId) {
  bookmarks = bookmarks.filter((bookmark) => bookmark.id !== listId);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  updateUi();
}

updateUi();
