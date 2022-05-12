/*

/│\s+([0-9]+)\s+│\s+([a-z-]+)\s+│\s+([a-z]+)\s+│\s+([0-9\.]+)\s+│\s+([a-z]+)\s+│\s+([0-9a-z\/]+)\s+│\s+([0-9a-z]+)\s+│\s+([0-9]+)\s+│\s+([a-z]+)\s+│\s+([0-9%]+)\s+│\s+([0-9a-z\.]+)\s+│\s+([0-9a-z_]+)\s+│\s+([a-z]+)\s+│\n/gi

"|" !== "│"

'|'.charCodeAt(0)
124
'│'.charCodeAt(0)
9474

TODO: may need /r for windows

*/

const type = {
  any: '.*',
  alpha: 'a-z',
  numeric: '0-9',
  dot: '\\.',
  dash: '-',
  fslash: '\\/',
}

const rowData = new Map();
rowData.set('id', [type.numeric,]);
rowData.set('pname', [type.alpha, type.dash,]);
rowData.set('namespace', [type.alpha,]);
rowData.set('version', [type.numeric, type.dot,]);
rowData.set('mode', [type.alpha,]);
rowData.set('pid', [type.numeric, type.alpha, type.fslash,]);
rowData.set('uptime', [type.numeric, type.alpha,]);
rowData.set('restarts', [type.numeric,]);
rowData.set('status', [type.alpha,]);
rowData.set('cpu', [type.numeric, '%',]);
rowData.set('mem', [type.numeric, type.dot, type.alpha,]);
rowData.set('user', [type.numeric, type.alpha, '_',]);
rowData.set('watching', [type.alpha,]);


const section = (typeList) => `\\s\+\(\[${typeList.join('')}\]\+\)\\s\+`;

const build = () => {
  const lineArr = []
  for (const [col, typeList] of rowData) {
    lineArr.push(section(typeList));
  }
  return new RegExp(`\│${lineArr.join('\│')}\│\\n`, 'ig');
}

module.exports = build();
