import "assets://js/lib/cat.js";
import "assets://js/lib/crypto-js.js";


async function init(cfg) {
cfg.skey = '金牌影院API';
cfg.stype = '3';
}
let url = 'https://www.fjvtw.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36';



async function home (filter) {

//一级
let classes = [
    {
      type_id: '1',
      type_name: '电影',
    },
    {
      type_id: '2',
      type_name: '电视',
    },
    {
      type_id: '3',
      type_name: '综艺',
    },
    {
      type_id: '4',
      type_name: '动漫',
    },
  ];

//二级
let filterObj = {};

return JSON.stringify({
    class: classes,
    filters: filterObj
});

}


//主页推荐
async function homeVod() {

let t = Date.now();
let sign = CryptoJS.SHA1(CryptoJS.MD5(`key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
let html = await req(`${url}/api/mw-movie/anonymous/home/hotSearch?`, {
  method: 'GET',
  headers: { 
    'User-Agent': UA,
    'Referer': url,
    "t": t,
    "sign": sign
  },
  postType: '' // 非 POST 请求时设为空
});

let res = JSON.parse(html.content).data;

let videos = res.map(item => ({
    vod_id: item.vodId,
    vod_name: item.vodName,
    vod_pic: item.vodPic,
    vod_remarks: item.vodRemarks,
    vod_year: ""
}));

return JSON.stringify({
    list: videos 
});

}

//分类
async function category (tid, pg, filter, extend) {

let t = Date.now();
let sign = CryptoJS.SHA1(CryptoJS.MD5(`area=&pageNum=${pg}&type1=${tid}&year=&key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
let html = await req(`${url}/api/mw-movie/anonymous/video/list?type1=${tid}&pageNum=${pg}&area=&year=`, {
  method: 'GET',
  headers: { 
    'User-Agent': UA,
    'Referer': url,
    "t": t,
    "sign": sign
  },
  postType: '' // 非 POST 请求时设为空
});

let res = JSON.parse(html.content).data.list;

let videos = res.map(item => ({
    vod_id: item.vodId,
    vod_name: item.vodName,
    vod_pic: item.vodPic,
    vod_remarks: item.vodRemarks,
    vod_year: ""
}));


  return JSON.stringify ({
    page: pg,
    pagecount: 999,
    limit: 10,
    total: 999,
    list: videos
  });
}

//详情
async function detail (id) {

let t = Date.now();
let sign = CryptoJS.SHA1(CryptoJS.MD5(`id=${id}&key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
let html = await req(`${url}/api/mw-movie/anonymous/video/detail?id=${id}`, {
  method: 'GET',
  headers: { 
    'User-Agent': UA,
    'Referer': url,
    "t": t,
    "sign": sign
  },
  postType: '' // 非 POST 请求时设为空
});

  let res = JSON.parse(html.content).data
  
  let play_from = res.vodVersion;
  let play_url =  res.episodeList.map(item => {

    return `${item.name}$${id}|${item.nid}`;

}).join('#');


var vod = [{
    "type_name": res.typeName,
    "vod_year": res.vodYear,
    "vod_area": res.vodArea,
    "vod_remarks": res.vodRemarks,
    "vod_content": res.vodContent,
    "vod_play_from": play_from, 
    "vod_play_url": play_url
    }];  

  return JSON.stringify ({
    list: vod
  });
}


//播放
async function play (flag, id, flags) {

let t = Date.now();
let sign = CryptoJS.SHA1(CryptoJS.MD5(`id=${id.split("|")[0]}&nid=${id.split("|")[1]}&key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
let html = await req(`${url}/api/mw-movie/anonymous/v1/video/episode/url?id=${id.split("|")[0]}&nid=${id.split("|")[1]}`, {
  method: 'GET',
  headers: { 
    'User-Agent': UA,
    'Referer': url,
    "t": t,
    "sign": sign
  },
  postType: '' // 非 POST 请求时设为空
});

  let res = JSON.parse(html.content).data.playUrl

  return JSON.stringify ({
    parse: 0,
    url: res
  });
}

//搜索
async function search (wd, quick) {

let t = Date.now();
let sign = CryptoJS.SHA1(CryptoJS.MD5(`keyword=${wd}&pageNum=1&pageSize=12&sourceCode=1&key=cb808529bae6b6be45ecfab29a4889bc&t=${t}`).toString()).toString();
let html = await req(`${url}/api/mw-movie/anonymous/video/searchByWord?keyword=${wd}&pageNum=1&pageSize=12&sourceCode=1`, {
  method: 'GET',
  headers: { 
    'User-Agent': UA,
    'Referer': url,
    "t": t,
    "sign": sign
  },
  postType: '' // 非 POST 请求时设为空
});

  let res = JSON.parse(html.content).data.result.list

let videos = res.map(item => ({
    vod_id: item.vodId,
    vod_name: item.vodName,
    vod_pic: item.vodPic,
    vod_remarks: item.vodRemarks,
    vod_year: item.vodYear
}));

  const limit = 10;
  return JSON.stringify ({
    limit: limit,
    list: videos
  });
}

export function __jsEvalReturn() {
  return {
      init: init,
      home: home,
      homeVod: homeVod,
      category: category,
      detail: detail,
      play: play,
      search: search
  };
}