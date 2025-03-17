import "assets://js/lib/cat.js";



async function init(cfg) {
cfg.skey = 'AGE动漫-动态分类';
cfg.stype = '3';
}
let url = 'https://ageapi.omwjhz.com:18888';
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

let classes = [{"type_id":"","type_name":"目录"}];
let filtersobj = {"":[{"key":"region","name":"地区","value":[{"n":"全部","v":"all"},{"n":"中国","v":"中国"},{"n":"日本","v":"日本"},{"n":"欧美","v":"欧美"}]},{"key":"genre","name":"版本","value":[{"v":"all","n":"版本"},{"v":"TV","n":"TV"},{"v":"剧场版","n":"剧场版"},{"v":"OVA","n":"OVA"}]},{"key":"year","name":"年份","value":[{"v":"all","n":"年份"},{"v":"2025","n":"2025"},{"v":"2024","n":"2024"},{"v":"2023","n":"2023"},{"v":"2022","n":"2022"},{"v":"2021","n":"2021"},{"v":"2020","n":"2020"},{"v":"2019","n":"2019"},{"v":"2018","n":"2018"},{"v":"2017","n":"2017"},{"v":"2016","n":"2016"},{"v":"2015","n":"2015"},{"v":"2014","n":"2014"},{"v":"2013","n":"2013"},{"v":"2012","n":"2012"},{"v":"2011","n":"2011"},{"v":"2010","n":"2010"},{"v":"2009","n":"2009"},{"v":"2008","n":"2008"},{"v":"2007","n":"2007"},{"v":"2006","n":"2006"},{"v":"2005","n":"2005"},{"v":"2004","n":"2004"},{"v":"2003","n":"2003"},{"v":"2002","n":"2002"},{"v":"2001","n":"2001"},{"v":"2000以前","n":"2000以前"}]},{"key":"order","name":"排序","value":[{"v":"点击量","n":"点击量"}]}]};
let html = await request(`${url}/v2/home-list`);
let res = JSON.parse(html).recommend;

//推荐
let videos = res.map(item => ({
    vod_id: item.AID,
    vod_name: item.Title,
    vod_pic: item.PicSmall,
    vod_remarks: item.NewTitle,
    vod_year: ""
 }))

return JSON.stringify({
    class: classes,
    filters: filtersobj,
    list: videos
});

}


//主页推荐
async function homeVod() {

}

//分类
async function category (tid, pg, filter, extend) {


let html = await request(`${url}/v2/catalog?genre=${extend.genre ? extend.genre : 'all'}&label=all&letter=all&order=${extend.order ? extend.order : 'time'}&region=${extend.region ? extend.region : 'all'}&resource=all&season=all&status=all&year=${extend.year ? extend.year : 'all'}&page=${pg}&size=10`);

let res = JSON.parse(html).videos;

let videos = res.map(item => ({
    vod_id: item.id,
    vod_name: item.name,
    vod_pic: item.cover,
    vod_remarks: item.uptodate,
    vod_year: ""
}));


  return JSON.stringify ({
    page: pg,
    pagecount: 99999,
    limit: 24,
    total: 99999,
    list: videos
  });
}

//详情
async function detail (id) {
  let html = await request (`${url}/v2/detail/${id}`);
  let res = JSON.parse(html);

  let vip = res.player_jx.vip
  let labelMap = res.player_label_arr

// 生成带本地化名称的vod_play_from
  let playSources = Object.keys(res.video.playlists);
  let localizedSources = playSources.map(source => labelMap[source] || source)
  let play_from = localizedSources.join('$$$')

// 生成vod_play_url（保持原逻辑）
const vodPlayUrlParts = playSources.map(source => {
  const episodes = res.video.playlists[source]
  return episodes.map(ep => `${ep[0]}$${vip}${ep[1]}`).join('#')
})
const play_url = vodPlayUrlParts.join('$$$')


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
    parse: 1,
    url: id
  });

}

//搜索
async function search (wd, quick) {
const html = await request (`${url}/v2/search?query=${wd}&page=1`);

let res = JSON.parse(html).data.videos;

let videos = res.map(item => ({
    vod_id: item.id,
    vod_name: item.name,
    vod_pic: item.cover,
    vod_remarks: item.uptodate,
    vod_year: ""
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