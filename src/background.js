// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCQXwyttLMQLpYttt0J_7tBS7Mb83yKz6A",
  authDomain: "snatcher-app.firebaseapp.com",
  databaseURL: "https://snatcher-app.firebaseio.com",
  projectId: "snatcher-app",
  storageBucket: "snatcher-app.appspot.com",
  messagingSenderId: "309876102845"
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();
const db = firebase.firestore();

console.log("Hello world!");

var currentTab;
var currentBookmark;

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  browser.browserAction.setIcon({
    path: currentBookmark
      ? {
          19: "icons/star-filled-19.png",
          38: "icons/star-filled-38.png"
        }
      : {
          19: "icons/star-empty-19.png",
          38: "icons/star-empty-38.png"
        },
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({
    // Screen readers can see the title
    title: currentBookmark ? "Unbookmark it!" : "Bookmark it!",
    tabId: currentTab.id
  });
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark() {
  if (currentBookmark) {
    browser.bookmarks.remove(currentBookmark.id);
  } else {
    browser.bookmarks.create({ title: currentTab.title, url: currentTab.url });
  }
  db.collection("users")
    .add({
      first: "Ada",
      last: "Lovelace",
      born: 1815
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}

browser.browserAction.onClicked.addListener(toggleBookmark);

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateActiveTab(tabs) {
  function isSupportedProtocol(urlString) {
    var supportedProtocols = ["https:", "http:", "ftp:", "file:"];
    var url = document.createElement("a");
    url.href = urlString;
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      if (isSupportedProtocol(currentTab.url)) {
        var searching = browser.bookmarks.search({ url: currentTab.url });
        searching.then(bookmarks => {
          currentBookmark = bookmarks[0];
          updateIcon();
        });
      } else {
        console.log(
          `Bookmark it! does not support the '${currentTab.url}' URL.`
        );
      }
    }
  }

  var gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  gettingActiveTab.then(updateTab);
}

// listen for bookmarks being created
browser.bookmarks.onCreated.addListener(updateActiveTab);

// listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(updateActiveTab);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();
