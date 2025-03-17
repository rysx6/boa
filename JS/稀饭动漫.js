import "assets://js/lib/cat.js";



async function init(cfg) {
cfg.skey = '稀饭动漫';
cfg.stype = '3';
}
let url = 'https://pzoap.moedot.net';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36';


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


async function home (filter) {

let classes = [{"type_id":1,"type_name":"连载新番"},{"type_id":2,"type_name":"完结旧番"},{"type_id":3,"type_name":"剧场版"},{"type_id":21,"type_name":"美漫"}];

let html = await request(`${url}/xgapp.php/v2/index_video`);
let res = JSON.parse(html).data;

//推荐
let videos = res.flatMap(vod => 
    vod.vlist.map(item => ({
    vod_id: item.vod_id,
    vod_name: item.vod_name,
    vod_pic: item.vod_pic,
    vod_remarks: item.vod_remarks,
    vod_year: ""
 }))
 );

return JSON.stringify({
    class: classes,
    filters: {},
    list: videos
});

}


//主页推荐
async function homeVod() {

}

//分类
async function category (tid, pg, filter, extend) {

let html = await request(`${url}/xgapp.php/v2/video?pg=${pg}&tid=${tid}&class=&area=&lang=&year=`);

let res = JSON.parse(html).data;

let videos = res.map(item => ({
    vod_id: item.vod_id,
    vod_name: item.vod_name,
    vod_pic: item.vod_pic,
    vod_remarks: item.vod_remarks,
    vod_year: item.vod_score
}));


  return JSON.stringify ({
    page: pg,
    pagecount: 99999,
    limit: 20,
    total: 99999,
    list: videos
  });
}

//详情
async function detail (id) {
  let html = await request (`${url}/xgapp.php/v2/video_detail?id=${id}`);
  let res = JSON.parse(html).data.vod_info;
  
  let play_from = res.vod_url_with_player.map(item => item.name).join('$$$');
  let play_url = res.vod_url_with_player.map(item => item.url).join('$$$');

var vod = [{
    "type_name": res.vod_class,
    "vod_year": res.vod_year,
    "vod_area": res.vod_area,
    "vod_remarks": res.vod_remarks,
    "vod_content": res.vod_content,
    "vod_play_from": play_from, 
    "vod_play_url": play_url
    }];  

  return JSON.stringify ({
    list: vod
  });
}


//播放
async function play (flag, id, flags) {


  return JSON.stringify ({
    parse: 0,
    url: id
  });

}

//搜索
async function search (wd, quick) {
const html = await request (`${url}/xgapp.php/v2/search?pg=1&text=${wd}`);

let res = JSON.parse(html).data;

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