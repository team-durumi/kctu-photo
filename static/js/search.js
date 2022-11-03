// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
// How many characters to include on either side of match keyword
const summaryInclude=60;
// Options for fuse.js
let fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  tokenize: true,
  matchAllTokens: true,
  threshold: 0.0,
  location: 0,
  distance: 100,
  maxPatternLength: 100,
  minMatchCharLength: 2,
  keys: [
    {name:"title",weight:0.8},
    {name:"reference_code",weight:0.8},
    {name:"tags",weight:0.5},
    {name:"creators",weight:0.5},
    {name:"venues",weight:0.5},
    {name:"sources",weight:0.5},
    {name:"culture_workers",weight:0.5},
    {name:"subjects",weight:0.5},
    {name:"contents",weight:0.3}
  ]
};

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

let searchQuery = getUrlParameter('q');

if (searchQuery){
  document.getElementById("search-query").value = searchQuery;
  document.getElementById("wait").classList.remove('hidden');
  executeSearch(searchQuery);
} else {
  // document.getElementById('search-results').innerHTML = "<p class=\"no-results\">위에 검색어를 입력하세요</p>";
}

function executeSearch(searchQuery) {
  // Look for "index.json" in the same directory where this script is called.
  fetch("index.json")
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      let fuse = new Fuse(data, fuseOptions);
      let result = fuse.search(searchQuery);
      document.getElementById("wait").classList.add('hidden');
      if (result.length > 0) {
        document.querySelector('#result-count').innerHTML = '<span class="p-2 rounded font-bold bg-green-500 text-white">' +result.length + '건</span>';
        populateResults(result);
      } else {
        document.getElementById('search-results').innerHTML = "<p class=\"no-results\">검색 결과가 없습니다.</p>";
      }
    });
}

function populateResults(result){
  result.forEach( function (value, key) {
    let contents= value.item.contents;
    let snippet = "";
    let snippetHighlights=[];
    snippetHighlights.push(searchQuery);
    if(snippet.length<1){
      var getSentenceByWordRegex = new RegExp(
        `[^.?!]*(?<=[.?\\s!])${searchQuery}(?=[\\s.?!])[^.?!]*[.?!]`,
        'i'
      );
      var maxTextLength = summaryInclude*2
      // Index of the matched search term
      var indexOfMatch = contents.toLowerCase().indexOf(
        searchQuery.toLowerCase()
      );
      // Index of the first word of the sentence with the search term in it
      var indexOfSentence = contents.indexOf(
        getSentenceByWordRegex.exec(contents)
      );

      var start
      var cutStart = false
      // Is the match in the result?
      if(indexOfSentence+maxTextLength < indexOfMatch){
        // Make sure that the match is in the result
        start = indexOfMatch
        // This bool is used to replace the first part with '...'
        cutStart = true
      } else {
        // Match is in view, even if we show the whole sentence
        start = indexOfSentence
      }

      // Change end length to the text length if it is longer than
      // the text length to prevent problems
      var end = start + maxTextLength
      if (end > contents.length){
        end = contents.length
      }

      if(cutStart){
        // Replace first three characters with '...'
        end -= 3;
        snippet += "…" + contents.substring(start, end).trim();
      }
      else{
        snippet += contents.substring(start, end).trim();
      }
    }
    snippet += "…";

    // Lifted from https://stackoverflow.com/posts/3700369/revisions
    var elem = document.createElement('textarea');
    elem.innerHTML = snippet;
    var decoded = elem.value;

    // Pull template from hugo template definition
    let frag = document.getElementById('search-result-template').content.cloneNode(true);
    // Replace values
    frag.querySelector(".search_summary").setAttribute("id", "summary-" + key);
    frag.querySelector(".search_link").setAttribute("href", value.item.permalink);
    frag.querySelector(".search_title").textContent = value.item.title;
    // frag.querySelector(".search_snippet").textContent = decoded;
    let image = value.item.image;
    if (image) {
      frag.querySelector(".search-if_thumb").setAttribute('src', image);
    } else {
      frag.querySelector(".search-if_thumb").remove();
    }
    let tags = value.item.tags;
    const tagTemplate = '<a href="/tags/{tag}" class="inline-block w-max mr-1 px-2 py-1 mb-2 bg-white dark:bg-black border-2 border-blue-600 dark:border-blue-500 border box-border rounded-2xl text-sm text-blue-600 dark:text-blue-500 strong">{tag}</a>';
    if (tags && tags.length > 0 && tags.indexOf("") === -1) {
      let tagItems = '';
      tags.forEach(tag => {
        tagItems += tagTemplate.replace(/{\s*(\w+?)\s*}/g, (_, token) => tag || '');
      });
      frag.querySelector(".search_tags").innerHTML = tagItems;
    } else {
      console.log('tag empty');
      frag.querySelector(".search-if_tags").remove();
    }
    let creators = value.item.creators;
    if (creators && creators.length > 0 && creators.indexOf("") === -1) {
      frag.querySelector(".search_creators").textContent = creators;
    } else {
      frag.querySelector(".search-if_creators").remove();
    }
    let venues = value.item.venues;
    if (venues && venues.length > 0 && venues.indexOf("") === -1) {
      frag.querySelector(".search_venues").textContent = venues;
    } else {
      frag.querySelector(".search-if_venues").remove();
    }
    let culture_workers = value.item.culture_workers;
    if (culture_workers && culture_workers.length > 0 && culture_workers.indexOf("") === -1) {
      frag.querySelector(".search_culture_workers").textContent = culture_workers;
    } else {
      frag.querySelector(".search-if_culture_workers").remove();
    }
    let sources = value.item.sources;
    if (sources && sources.length > 0 && sources.indexOf("") === -1) {
      frag.querySelector(".search_sources").textContent = sources;
    } else {
      frag.querySelector(".search-if_sources").remove();
    }
    let subjects = value.item.subjects;
    if (subjects && subjects.length > 0 && subjects.indexOf("") === -1) {
      frag.querySelector(".search_subjects").textContent = subjects;
    } else {
      frag.querySelector(".search-if_subjects").remove();
    }
    let categories = value.item.categories;
    if (categories && categories.length > 0 && categories.indexOf("") === -1) {
      frag.querySelector(".search_categories").textContent = categories;
    } else {
      frag.querySelector(".search-if_categories").remove();
    }
    snippetHighlights.forEach( function (snipvalue, snipkey) {
      let markjs = new Mark(frag);
      markjs.mark(snipvalue);
    });
    document.getElementById("search-results").appendChild(frag);
  });
}
// @license-end
