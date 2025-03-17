import "assets://js/lib/cat.js";
import "assets://js/lib/crypto-js.js";


async function init(cfg) {
cfg.skey = '番薯';
cfg.stype = '3';
}
let url = 'http://103.143.81.86:17654';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36';

//解密
function AES1(data) {
    const key = CryptoJS.enc.Utf8.parse('N4yj7l7xKxHF4*gz');
    const iv = CryptoJS.enc.Utf8.parse('N4yj7l7xKxHF4*gz');
    const decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

//加密
function AES2(data) {
    const key = CryptoJS.enc.Utf8.parse('N4yj7l7xKxHF4*gz');
    const iv = CryptoJS.enc.Utf8.parse('N4yj7l7xKxHF4*gz');
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}


async function request (reqUrl, mth) {
  const res = await req (reqUrl, {
    method: mth || 'get',
    headers: {
      'User-Agent': UA,
      referer: url,
    },
    postType: mth === 'post' ? 'form' : '',
  });
  return res.content;
}


//分类数据
async function home (filter) {
  let classes = [
    {
      type_id: '1',
      type_name: '番剧',
    },
    {
      type_id: '3',
      type_name: '剧场',
    },
    {
      type_id: '20',
      type_name: '4K',
    },
    {
      type_id: '21',
      type_name: '美漫',
    }
  ];
  let filterObj = {};
  return JSON.stringify({
    class: classes,
    filters: filterObj,
  });
}

//主页推荐
async function homeVod() {
let html = await request(`${url}/api.php/getappapi.index/initV119`);

let res = JSON.parse(AES1(JSON.parse(html).data)).banner_list;

let videos = res.map(item => ({
    vod_id: item.vod_id,
    vod_name: item.vod_name,
    vod_pic: item.vod_pic,
    vod_remarks: item.vod_remarks,
    vod_year: ""
}));


return JSON.stringify({
    list: videos
});
}

//分类
async function category (tid, pg, filter, extend) {

let html = await request(`${url}/api.php/getappapi.index/typeFilterVodList?area=%E5%85%A8%E9%83%A8&year=%E5%85%A8%E9%83%A8&type_id=${tid}&page=${pg}&sort=%E6%9C%80%E6%96%B0`);

let res = JSON.parse(AES1(JSON.parse(html).data)).recommend_list;

let videos = res.map(item => ({
    vod_id: item.vod_id,
    vod_name: item.vod_name,
    vod_pic: item.vod_pic,
    vod_remarks: item.vod_remarks,
    vod_year: ""
}));


  return JSON.stringify ({
    page: pg,
    pagecount: 99999,
    limit: 30,
    total: 99999,
    list: videos
  });
}

//详情
async function detail (id) {
  let html = await request (`${url}/api.php/getappapi.index/vodDetail?vod_id=${id}`);
  let res = JSON.parse(AES1(JSON.parse(html).data));
  
  let play_from = res.vod_play_list.map(item => item.player_info.show).join('$$$');
  let play_url = res.vod_play_list.map(play => {
    let p = play.player_info.parse; // 获取 parse
    return play.urls.map(item => {
        let name = item.name;
        let url = item.url;
        let urls = p ? `${p}|${url}` : url;    // 如果 p 有值，则将其加到 url 前，并用 | 分隔，空则返回原 url
        return `${name}$${urls}`; 
    }).join('#');
}).join('$$$');

var vod = [{
    "type_name": res.vod.vod_class,
    "vod_year": res.vod.vod_year,
    "vod_area": res.vod.vod_area,
    "vod_remarks": res.vod.vod_remarks,
    "vod_content": res.vod.vod_content,
    "vod_play_from": play_from, 
    "vod_play_url": play_url
    }];  

  return JSON.stringify ({
    list: vod
  });
}


//播放
async function play (flag, id, flags) {

if (id.indexOf("|") > -1){

  let html = await request (`${url}/api.php/getappapi.index/vodParse?parse_api=${id.split("|")[0]}&url=${encodeURIComponent(AES2(id.split("|")[1]))}`);
  let res = JSON.parse(AES1(JSON.parse(html).data)).json;
  let playUrl = JSON.parse(res).url;

  return JSON.stringify ({
    parse: 0,
    url: playUrl
  });

}else{

  return JSON.stringify ({
    parse: 0,
    url: id
  });

}
}

//搜索
async function search (wd, quick) {
const html = await request (`${url}/api.php/getappapi.index/searchList?keywords=${wd}&type_id=0&page=1`);

let res = JSON.parse(AES1(JSON.parse(html).data)).search_list;

let videos = res.map(item => ({
    vod_id: item.vod_id,
    vod_name: item.vod_name,
    vod_pic: item.vod_pic,
    vod_remarks: item.vod_remarks,
    vod_year: item.vod_year
}));

  const limit = 20;
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