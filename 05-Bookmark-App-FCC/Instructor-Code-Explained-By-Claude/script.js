// Grab a reference to the "Add Bookmark" button element from the DOM by its id attribute
const addBookmarkBtn = document.getElementById("add-bookmark");

// Grab a reference to the <ul> or <ol> (or other container) that will hold the bookmark <li> items
const bookmarkList = document.getElementById("bookmark-list");

// Grab a reference to the text input where the user types the bookmark's display name
const bookmarkNameInput = document.getElementById("bookmark-name");

// Grab a reference to the text input where the user types the bookmark's URL
const bookmarkUrlInput = document.getElementById("bookmark-url");

// Register a listener that fires once, when the initial HTML document has been completely
// loaded and parsed (doesn't wait for images/stylesheets). Calls loadBookmarks() at that point
// so any previously saved bookmarks get rendered onto the page as soon as it's ready.
document.addEventListener("DOMContentLoaded", loadBookmarks);

// Attach a click listener to the "Add Bookmark" button. When clicked, the anonymous function
// below runs. This function is defined inline (a "function expression") rather than as a
// separate named function elsewhere in the file.
addBookmarkBtn.addEventListener("click", function () {

  // Read the current value out of the name input box.
  // .trim() strips leading/trailing whitespace so " My Site " becomes "My Site".
  const name = bookmarkNameInput.value.trim();

  // Same idea for the URL input: read its value and strip whitespace.
  const url = bookmarkUrlInput.value.trim();

  // If name is an empty string (falsy) OR url is an empty string (falsy), the user left
  // a field blank. The ! operator flips truthy/falsy, so this reads as
  // "if NOT name OR NOT url".
  if (!name || !url) {
    // Show a native browser popup telling the user what went wrong.
    alert("Please enter both name and URL.");
    // Exit the function immediately — don't run any code below this point for this click.
    return;
  } else {
    // We only get here if both name and url were non-empty.
    // Now check that the URL starts with a proper protocol.
    // .startsWith() checks if the string begins with the given substring.
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      // Neither prefix matched, so warn the user their URL is invalid.
      alert("Please enter a valid URL starting with http:// or https://");
      // Stop here — don't add an invalid bookmark.
      return;
    }

    // At this point name and url both passed validation.
    // Call addBookmark to build and insert the new <li> into the visible list.
    addBookmark(name, url);
    // Call saveBookmark to persist this new bookmark into localStorage as well.
    saveBookmark(name, url);
    // Clear out the input boxes so the form is ready for the next entry.
    bookmarkNameInput.value = "";
    bookmarkUrlInput.value = "";
  }
});

// Defines a function that creates and displays one bookmark's DOM elements.
// Takes the bookmark's name and url as parameters.
function addBookmark(name, url) {

  // Create a new <li> element in memory (not yet attached to the page).
  const li = document.createElement("li");

  // Create a new <a> (anchor/link) element in memory.
  const link = document.createElement("a");

  // Set the anchor's href attribute to the bookmark's URL — this is where clicking it goes.
  link.href = url;

  // Set the visible text of the link to the bookmark's name.
  // textContent (not innerHTML) safely inserts plain text, without interpreting it as HTML.
  link.textContent = name;

  // Set target="_blank" so clicking the link opens it in a new browser tab/window.
  link.target = "_blank";

  // Create a new <button> element in memory for removing this bookmark.
  const removeButton = document.createElement("button");

  // Set the button's visible label text.
  removeButton.textContent = "Remove";

  // Attach a click listener directly to this specific remove button.
  // Because this function is created fresh inside addBookmark(), it forms a "closure" —
  // it remembers/has access to this exact li, name, and url variables from the outer scope,
  // even after addBookmark() has finished running.
  removeButton.addEventListener("click", function () {
    // Remove this specific <li> element from the bookmarkList container in the DOM.
    // removeChild requires the parent (bookmarkList) and the exact child node to remove (li).
    bookmarkList.removeChild(li);
    // Also remove this bookmark's data from localStorage so it doesn't reappear on reload.
    removeBookmarkFromStorage(name, url);
  });

  // Insert the link <a> element inside the <li> element (li now contains the link).
  li.appendChild(link);

  // Insert the remove <button> element inside the <li> as well (li now contains link + button).
  li.appendChild(removeButton);

  // Finally, attach the fully-built <li> (with its link and button inside) onto the
  // visible bookmarkList container, making it appear on the page.
  bookmarkList.appendChild(li);
}

// Defines a helper function whose only job is reading and parsing bookmarks from localStorage.
// Centralizing this logic avoids repeating the same parsing code in multiple places.
function getBookmarksFromStorage() {

  // Attempt to read the string stored under the key "bookmarks" in the browser's localStorage.
  // Returns null if nothing has been stored yet under that key.
  const bookmarks = localStorage.getItem("bookmarks");

  // Ternary operator: if bookmarks is truthy (a string was found), parse it from JSON text
  // back into a real JavaScript array/object. If it's null/falsy, return an empty array instead
  // so the rest of the code can safely call array methods on the result without crashing.
  return bookmarks ? JSON.parse(bookmarks) : [];
}

// Defines a function that adds one new bookmark to localStorage's saved list.
function saveBookmark(name, url) {

  // Get the current array of saved bookmarks (or an empty array if none exist yet).
  const bookmarks = getBookmarksFromStorage();

  // Add a new object literal { name, url } to the end of the array.
  // { name, url } is ES6 shorthand for { name: name, url: url }.
  bookmarks.push({ name, url });

  // Convert the updated array back into a JSON string and overwrite what's stored under
  // the "bookmarks" key in localStorage, persisting the change.
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Defines a function that runs once when the page finishes loading, to rebuild the
// visible list from whatever was previously saved.
function loadBookmarks() {

  // Fetch the saved array of bookmarks from localStorage.
  const bookmarks = getBookmarksFromStorage();

  // .forEach loops over every saved bookmark object in the array.
  // For each one, call addBookmark() with its name and url to recreate its DOM elements
  // and display it on the page (this does NOT re-save it — just re-renders it).
  bookmarks.forEach((bookmark) => addBookmark(bookmark.name, bookmark.url));
}

// Defines a function that removes one bookmark's data from localStorage,
// matching by both name and url.
function removeBookmarkFromStorage(name, url) {

  // Get the current saved bookmarks array. Declared with 'let' (not 'const') because
  // this variable will be reassigned below via .filter().
  let bookmarks = getBookmarksFromStorage();

  // .filter() builds a new array containing only the bookmarks that do NOT match
  // both the given name and url — i.e., it keeps every bookmark except the one being removed.
  // The condition reads: keep this bookmark if its name is different OR its url is different.
  bookmarks = bookmarks.filter((bookmark) => bookmark.name !== name || bookmark.url !== url);

  // Save the filtered (bookmark-removed) array back into localStorage as an updated JSON string.
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}