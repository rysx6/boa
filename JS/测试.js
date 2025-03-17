import "assets://js/lib/cat.js";
import "assets://js/lib/crypto-js.js";

//曼波次元城解密测试
//https://tutuniubi.oss-cn-hangzhou.aliyuncs.com/666.txt

async function init(cfg) {
cfg.skey = '测试';
cfg.stype = '3';
}
let url = 'https://app.omofun1.top';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29';

//解密
function AES1(data) {
    const key = CryptoJS.enc.Utf8.parse('66dc309cbeeca454');
    const iv = CryptoJS.enc.Utf8.parse('66dc309cbeeca454');
    const decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

//加密
function AES2(data) {
    const key = CryptoJS.enc.Utf8.parse('66dc309cbeeca454');
    const iv = CryptoJS.enc.Utf8.parse('66dc309cbeeca454');
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

//动态分类
async function home (filter) {
let html = await request(`${url}/api.php/getappapi.index/initV119`);
let res = JSON.parse(AES1(JSON.parse(html).data));

//一级
let classes = res.type_list.map(tp => ({
  type_id: tp.type_id,
  type_name: tp.type_name
})).filter(item => item.type_name !== "全部");

//二级
let filterObj = res.type_list.reduce((acc, tp) => {
  if (tp.filter_type_list) {
    acc[tp.type_id] = tp.filter_type_list.map(filter => ({
      key: filter.name,
      name: filter.list[0],
      value: filter.list.map(item => ({
        n: item,
        v: item
      }))
    }));
  }
  return acc;
}, {});

//推荐
let videos = res.banner_list.map(item => ({
    vod_id: item.vod_id,
    vod_name: item.vod_name,
    vod_pic: item.vod_pic,
    vod_remarks: item.vod_remarks,
    vod_year: ""
}));

return JSON.stringify({
    class: classes,
    filters: filterObj,
    list: videos
});

}


//主页推荐
async function homeVod() {

}

//分类
async function category (tid, pg, filter, extend) {

let html = await request(`${url}/api.php/getappapi.index/typeFilterVodList?area=${extend.area ? extend.area : ''}&year=${extend.year ? extend.year : ''}&type_id=${tid}&page=${pg}&sort=${extend.sort ? extend.sort : ''}&lang=${extend.lang ? extend.lang : ''}&class=${extend.class ? extend.class : ''}`);

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
        let urls = p 
    ? (p.includes('php?url=') || p.includes('cycanime'))  // 如果 p 包含 'php?url=' 或 'cycanime'
        ? `${p}${url}`  // 直接拼接 p 和 url
        : `${p}|${url}`  // 否则使用 '|' 拼接 p 和 url
    : url;  // 如果 p 不存在，则 urls 为 url

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

if (id.indexOf("cycanime") > -1){
//次元城
let html = await request(`${id}`);
let res = html.match(/\"url\": \"(.+?)\"/)[1];
let aa = html.match(/charset=\"UTF-8\" id=\"now_(.+?)\"/)[1];
let bb = html.match(/name=\"viewport\".+id=\"now_(.+?)\"/)[1];

let cc = ''; // 定义 cc 变量以拼接结果
for (let i = 0; i < aa.length; i++) {
  const index = aa.indexOf(i.toString()); // 找到 aa 中数字 i 的位置
  cc += bb[index]; // 将 bb 中对应位置的字符拼接到 cc
}
let dd = CryptoJS.MD5(`${cc}YLwJVbXw77pk2eOrAnFdBo2c3mWkLtodMni2wk81GCnP94ZltW`).toString();

let con = CryptoJS.AES.decrypt(res, CryptoJS.enc.Utf8.parse(dd.slice(16)), {
    iv: CryptoJS.enc.Utf8.parse(dd.slice(0, 16)),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
}).toString(CryptoJS.enc.Utf8);

  return JSON.stringify ({
    parse: 0,
    url: con
  });


}


//曼波
if (id.indexOf("|") > -1){
  let html = await request (`${url}/api.php/getappapi.index/vodParse?parse_api=${id.split("|")[0]}&url=${encodeURIComponent(AES2(id.split("|")[1]))}`);
  let res = JSON.parse(AES1(JSON.parse(html).data)).json;
  let playUrl = JSON.parse(res).url;
  return JSON.stringify ({
    parse: 0,
    url: playUrl
  });
}
//哦耶
if (id.includes('php?url=dm295')) {
let html = await request (`${id}`);
let playUrl = JSON.parse(html).url
return JSON.stringify ({
    parse: 0,
    url: playUrl
  });
}else{
//普通
return JSON.stringify ({parse: 0,url: id});
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