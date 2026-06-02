/**
 * 歯科外傷対応マニュアル - アプリケーションロジック
 * IADTガイドライン準拠
 */

const DATA = {
  fracture: {
    label: '破折性外傷',
    items: [
      { id:'craze', name:'クレーズライン', sub:'エナメル質のひび割れ',
        perm:{ tx:['経過観察'], obs:['6〜8週','1年'] },
        milk:{ tx:['経過観察'], obs:['1〜2ヶ月'] } },
      { id:'enamel', name:'単純歯冠破折', sub:'エナメル質のみ・歯髄露出なし',
        perm:{ tx:['形態修正','CR修復'], obs:['6〜8週','1年'] },
        milk:{ tx:['形態修正','CR修復'], obs:['1〜2ヶ月'] } },
      { id:'complex_crown', name:'複雑歯冠破折', sub:'歯髄露出あり',
        perm:{ tx:['直覆 or 断髄 → 破折片接着 or CR修復'], obs:['6〜8週','1年'] },
        milk:{ tx:['直覆 or 断髄 → 破折片接着 or CR修復'], obs:['1〜2ヶ月'] } },
      { id:'simple_cr', name:'単純歯冠歯根破折', sub:'歯髄露出なし',
        perm:{ tx:['歯肉縁上修復','矯正的挺出','外科的挺出','→ 以後は単純歯冠破折に準じる'], obs:['6〜8週','1年'] },
        milk:{ tx:['保存可能：GI or CR','保存不可：破折片除去 or 抜歯'], obs:['1週','1〜2ヶ月','1年'] } },
      { id:'complex_cr', name:'複雑歯冠歯根破折', sub:'歯髄露出あり',
        perm:{ tx:['歯肉縁上修復','矯正的挺出','外科的挺出','→ 以後は複雑歯冠破折に準じる'], obs:['6〜8週','1年'] },
        milk:{ tx:['保存可能：直覆 or 断髄・GI or CR','保存不可：破折片除去 or 抜歯'], obs:['1週','1〜2ヶ月','1年'] } },
      { id:'root_fx', name:'歯根破折', sub:'',
        perm:{ tx:['整復＋固定（4週）','歯髄壊死 → 歯冠側のみRCT'], obs:['4週（固定除去）','6〜8週','4ヶ月（歯頸部破折は固定除去）','6ヶ月','1年','2年','3年','4年','5年'] },
        milk:{ tx:['経過観察','変位・動揺・咬合干渉が大きければ：破折片抜歯 or 整復固定4週'], obs:['1週','4週（固定除去）','2ヶ月','1年'] } },
      { id:'alveolar', name:'歯槽骨骨折', sub:'',
        perm:{ tx:['整復＋固定（4週）','歯髄診継続'], obs:['4週（固定除去）','6〜8週','4ヶ月','6ヶ月','1年','2年','3年','4年','5年'] },
        milk:{ tx:['動揺・咬合干渉があれば整復固定4週'], obs:['1週','4週（固定除去）','2ヶ月','1年'] } }
    ]
  },
  dislocation: {
    label: '脱臼性外傷',
    items: [
      { id:'concussion', name:'震盪', sub:'動揺なし・変位なし',
        perm:{ tx:['経過観察'], obs:['4週','1年'] },
        milk:{ tx:['経過観察'], obs:['1週','1年'] } },
      { id:'subluxation', name:'亜脱臼', sub:'動揺あり・変位なし',
        perm:{ tx:['経過観察','動揺強・咬合痛強の場合は固定（2週）'], obs:['2週（固定除去）','3ヶ月','6ヶ月','1年'] },
        milk:{ tx:['経過観察'], obs:['1週','1年'] } },
      { id:'extrusion', name:'挺出性脱臼', sub:'歯が長軸方向に飛び出した',
        perm:{ tx:['整復＋固定（2週）'], obs:['2週（固定除去）','1ヶ月','2ヶ月','3ヶ月','6ヶ月','1年','2年','3年','4年','5年'] },
        milk:{ tx:['自然整復','3mm以上の挺出 or 動揺大 → 抜歯'], obs:['1週','1〜2ヶ月','1年'] } },
      { id:'lateral', name:'側方性脱臼', sub:'歯が側方に変位',
        perm:{ tx:['整復＋固定（4週）','2週でRCT'], obs:['2週','4週（固定除去）','2ヶ月','3ヶ月','6ヶ月','1年','2年','3年','4年','5年'] },
        milk:{ tx:['自然整復','変位大 → 抜歯 or 整復固定4週'], obs:['1週','4週（固定除去）','2ヶ月','6ヶ月','1年'] } },
      { id:'intrusion', name:'埋入性脱臼', sub:'歯が骨内に押し込まれた',
        perm:{ tx:['【根未完成歯】自然萌出（4週で萌出なければ矯正的挺出）','【根完成 <3mm】自然萌出（8週で外科的挺出・4週固定）','【根完成 3〜7mm】矯正的 or 外科的挺出','【根完成 >7mm】外科的挺出','2週でRCT'], obs:['2週','4週（固定除去）','2ヶ月','3ヶ月','6ヶ月','1年','2年','3年','4年','5年'] },
        milk:{ tx:['自然萌出'], obs:['1週','1〜2ヶ月','6ヶ月','1年'] } }
    ]
  }
};

const AVULSION = {
  complete: {
    pre: { title:'根完成歯｜受診前に再植済み', note:null, steps:['受傷部位の清傷（水 or 生理食塩水）','再植位置が正しいことを口腔内およびレントゲンにて確認','必要に応じて局所麻酔（エピネフリン非含有が望ましい）','角度がおかしい場合は弱圧にて修正。誤った抜歯窩への再植は受傷後48時間以内であれば正しい抜歯窩への再植を考慮','2週間のフレキシブルな固定（骨折を伴う場合は4週間のリジッドな固定）','裂創の縫合','2週間以内に根管治療','抗菌薬の全身投与','破傷風ワクチン接種確認・術後指導・フォローアップ'] },
    short: { title:'根完成歯｜口腔外乾燥時間 < 60分', note:null, steps:['脱離歯を生理食塩水で洗浄し保存液中に置く','局所麻酔（エピネフリン非含有が望ましい）','抜歯窩を生理食塩水で洗浄・精査。骨折片変位があれば整復','生理食塩水にて血餅除去','脱離歯をゆっくり弱圧で整復。口腔内およびレントゲンにて位置を確認','2週間のフレキシブルな固定（骨折を伴う場合は4週間のリジッドな固定）','裂創の縫合','2週間以内に根管治療','抗菌薬の全身投与','破傷風ワクチン接種確認・術後指導・フォローアップ'] },
    long: { title:'根完成歯｜口腔外乾燥時間 > 60分', note:'ゴールは置換性歯根吸収（アンキローシス）。将来的な低位咬合によりデコロネーションや自家歯牙移植が必要になる可能性あり。アンキローシスや吸収の速度は個人差があり正確には予測できない。', steps:['脱離歯を生理食塩水または生食ガーゼで洗浄し保存液中に置く','局所麻酔（エピネフリン非含有が望ましい）','抜歯窩を生理食塩水で洗浄・精査。骨折片変位があれば整復','生理食塩水にて血餅除去','脱離歯をゆっくり弱圧で整復。口腔内およびレントゲンにて位置を確認','2週間のフレキシブルな固定（骨折を伴う場合は4週間のリジッドな固定）','裂創の縫合','2週間以内に根管治療','抗菌薬の全身投与','破傷風ワクチン接種確認・術後指導・フォローアップ'] }
  },
  incomplete: {
    pre: { title:'根未完成歯｜受診前に再植済み', note:null, steps:['受傷部位の清傷（水 or 生理食塩水）','再植位置が正しいことを口腔内およびレントゲンにて確認','必要に応じて局所麻酔（エピネフリン非含有が望ましい）','角度がおかしい場合は弱圧にて修正。誤った抜歯窩への再植は受傷後48時間以内であれば正しい抜歯窩への再植を考慮','2週間のフレキシブルな固定（骨折を伴う場合は4週間のリジッドな固定）','裂創の縫合','Pulp revascularizationを期待する。ただし炎症性歯根吸収の回避が優先。歯髄壊死/感染が疑われた場合はアペキシフィケーション/歯髄再生療法/根管治療を可及的速やかに実施','抗菌薬の全身投与','破傷風ワクチン接種確認・術後指導・フォローアップ'] },
    short: { title:'根未完成歯｜口腔外乾燥時間 < 60分', note:null, steps:['脱離歯を生理食塩水で洗浄し保存液中に置く','局所麻酔（エピネフリン非含有が望ましい）','抜歯窩を生理食塩水で洗浄・精査。骨折片変位があれば整復','生理食塩水にて血餅除去','脱離歯をゆっくり弱圧で整復。口腔内およびレントゲンにて位置を確認','2週間のフレキシブルな固定（骨折を伴う場合は4週間のリジッドな固定）','裂創の縫合','Pulp revascularizationを期待する。ただし炎症性歯根吸収の回避が優先。歯髄壊死/感染が疑われた場合はアペキシフィケーション/歯髄再生療法/根管治療を可及的速やかに実施','抗菌薬の全身投与','破傷風ワクチン接種確認・術後指導・フォローアップ'] },
    long: { title:'根未完成歯｜口腔外乾燥時間 > 60分', note:'ゴールは置換性歯根吸収（アンキローシス）。将来的な低位咬合によりデコロネーションや自家歯牙移植が必要になる可能性あり。アンキローシスや吸収の速度は個人差があり正確には予測できない。', steps:['脱離歯を生理食塩水で洗浄し保存液中に置く','局所麻酔（エピネフリン非含有が望ましい）','抜歯窩を生理食塩水で洗浄・精査。骨折片変位があれば整復','生理食塩水にて血餅除去','脱離歯をゆっくり弱圧で整復。口腔内およびレントゲンにて位置を確認','2週間のフレキシブルな固定（骨折を伴う場合は4週間のリジッドな固定）','裂創の縫合','Pulp revascularizationを期待する。ただし炎症性歯根吸収の回避が優先。歯髄壊死/感染が疑われた場合はアペキシフィケーション/歯髄再生療法/根管治療を可及的速やかに実施','抗菌薬の全身投与','破傷風ワクチン接種確認・術後指導・フォローアップ'] }
  }
};

const titles = {
  splashScreen:'歯科外傷対応マニュアル',
  dentistHome:'歯科医師モード',
  receptionHome:'受付スタッフモード',
  diagListScreen:'診断一覧',
  detailScreen:'診断詳細',
  avulsionScreen:'脱離歯プロトコル',
  recPhone:'電話対応マニュアル',
  recVisit:'来院対応マニュアル'
};

let hist = ['splashScreen'];
let curCat = '', curId = '', toothType = 'perm';
let rootSel = null, timeSel = null;

function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  hist.push(id);
  updateHeader(id);
  window.scrollTo(0,0);
}

function goBack() {
  if (hist.length <= 1) return;
  hist.pop();
  const prev = hist[hist.length-1];
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(prev).classList.add('active');
  updateHeader(prev);
  window.scrollTo(0,0);
}

function updateHeader(id) {
  document.getElementById('headerTitle').textContent = titles[id] || '';
  document.getElementById('backBtn').classList.toggle('show', id !== 'splashScreen');
}

function showDiagList(cat) {
  curCat = cat;
  const d = DATA[cat];
  let html = `<p class="section-label">${d.label}</p>`;
  d.items.forEach(item => {
    html += `<div class="diag-item" onclick="showDetail('${cat}','${item.id}')">
      <div class="diag-item-left"><h3>${item.name}</h3>${item.sub?`<p>${item.sub}</p>`:''}</div>
      <span class="diag-arrow">›</span>
    </div>`;
  });
  document.getElementById('diagListContent').innerHTML = html;
  go('diagListScreen');
}

function showDetail(cat, id) {
  curCat = cat; curId = id; toothType = 'perm';
  renderDetail();
  go('detailScreen');
}

function renderDetail() {
  const item = DATA[curCat].items.find(i => i.id === curId);
  const d = item[toothType];
  let html = `
    <h2 style="font-size:18px;font-weight:700;margin-bottom:4px">${item.name}</h2>
    ${item.sub?`<p style="color:var(--muted);font-size:13px;margin-bottom:16px">${item.sub}</p>`:'<div style="margin-bottom:16px"></div>'}
    <div class="toggle">
      <button class="${toothType==='perm'?'on':''}" onclick="switchTooth('perm')">🦷 永久歯</button>
      <button class="${toothType==='milk'?'on':''}" onclick="switchTooth('milk')">🌸 乳歯</button>
    </div>
    <div class="block">
      <div class="block-head">治療方法</div>
      <div class="block-body"><ul>${d.tx.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    </div>
    <div class="block">
      <div class="block-head">経過観察スケジュール</div>
      <div class="block-body"><div class="timeline">${d.obs.map(o=>`<span class="tl-chip">${o}</span>`).join('')}</div></div>
    </div>`;
  if (toothType==='milk') html += `<div class="note">⚠️ 乳歯外傷は永久歯への交換まで継続して経過観察してください。</div>`;
  document.getElementById('detailContent').innerHTML = html;
}

function switchTooth(t) { toothType = t; renderDetail(); }

function setRoot(r) {
  rootSel = r;
  ['complete','incomplete'].forEach(v => document.getElementById('r-'+v).classList.toggle('on', v===r));
  renderAvulsion();
}

function setTime(t) {
  timeSel = t;
  ['pre','short','long'].forEach(v => document.getElementById('t-'+v).classList.toggle('on', v===t));
  renderAvulsion();
}

function renderAvulsion() {
  const el = document.getElementById('avulsionResult');
  if (!rootSel || !timeSel) { el.innerHTML=''; return; }
  const p = AVULSION[rootSel][timeSel];
  let html = `<p style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:12px">${p.title}</p>
    <div class="step-list">`;
  p.steps.forEach((s,i) => {
    html += `<div class="step"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`;
  });
  html += '</div>';
  if (p.note) html += `<div class="note">⚠️ ${p.note}</div>`;
  el.innerHTML = html;
}

// グローバルスコープへ関数を露出
window.go = go;
window.goBack = goBack;
window.showDiagList = showDiagList;
window.showDetail = showDetail;
window.switchTooth = switchTooth;
window.setRoot = setRoot;
window.setTime = setTime;
