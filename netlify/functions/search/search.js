const data = require('./index.json');
const MiniSearch = require('minisearch');
const Itemsjs = require('itemsjs');

const itemjsConfig = {
  native_search_enabled: false,
  sortings: {
    title_desc: {
      field: 'title',
      order: 'desc'
    }
  },
  aggregations: {
    subjects: {
      title: '주제',
      size: 10,
      conjunction: false
    },
    creators: {
      title: '조직',
      size: 10,
      conjunction: false
    },
    venues: {
      title: '장소',
      size: 10,
      conjunction: false
    },
    events: {
      title: '행사',
      size: 10,
      conjunction: false
    },
    culture_workers: {
      title: '',
      size: 10,
      conjunction: false
    },
    issues: {
      title: '사건',
      size: 10,
      conjunction: false
    },
    tags: {
      title: '태그',
      size: 10,
      conjunction: false
    }
  }
}
const searchableFields = [
  'title', "contents",
  "subjects", "creators", "venues", "events", "culture_workers", "issues", "tags"
];

let miniSearch = new MiniSearch({ fields: searchableFields });
miniSearch.addAll(data);
const itemsjs = Itemsjs(data, itemjsConfig);

const handler = async (event) => {
  try {
    let results = [];
    const query = event.queryStringParameters;
    if (typeof query.q != 'undefined' && query.q != '') {
      const search_results = miniSearch.search(query.q)
      results = itemsjs.search({
        per_page: 12,
        ids: search_results.map(v => v.id)
      });
    }
    else {
      results = {
        "status": "error",
        "message": "query empty"
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  }
  catch (error) {
    return {
      tatusCode: 500,
      body: error.toString()
    }
  }
}

module.exports = { handler }
