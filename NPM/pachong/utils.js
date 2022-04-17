let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");

async function getDBJSON(page = 1, limit = 50, type = "movie", tag = "热门") {
  let baseURI = "https://movie.douban.com/j/search_subjects";
  let source = [];
  for (let i = 0; i <= page - 1; i++) {
    let params = `type=${type}&tag=${encodeURI(
      tag
    )}&page_limit=${limit}&page_start=${getPage(i)}`;
    let ret = await axios.get(`${baseURI}?${params}`);
    const { data = {} } = ret;
    const { subjects = [] } = data;
    source = source.concat(subjects);
  }
  console.log(source);
  fs.writeFile("./test.json", JSON.stringify(source), function () {
    console.log("success!");
  });
  // console.log(ret.data);
}

function getPage(i) {
  if (i % 2 == 0) {
    return i * 50;
  }
  return i * 50 + 1;
}

module.exports = {
  getDBJSON,
};
