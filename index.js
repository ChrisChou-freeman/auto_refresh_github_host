
'use strict';

const fs = require('fs');
const https = require('https');

const hostsFilePath = '/etc/hosts';

async function download(){
  return new Promise(resolve=>{
    const returnData = {error: null, data: null};
    const options = {
      path: '/gh/521xueweihan/GitHub520@main/hosts',
      hostname: 'cdn.jsdelivr.net',
      method: 'GET',
      agent: false
    };
    const req = https.request(options, (res)=>{
      if(res.statusCode != 200){
        returnData.error = new Error(res.statusCode);
        resolve(returnData);
        return;
      }
      let body = '';
      res.on('data', chunk=>{
        body+= chunk;
      });
      res.on('end', ()=>{
        returnData.data = body;
        resolve(returnData);
        return;
      })
    });
    req.on('error', err=>{
      returnData.error = err;
      resolve(returnData);
      return;
    });
    req.end();
  });
}

async function main(){
  const reExpression = /# GitHub520 Host Start([\s\S]*?)# GitHub520 Host End/;
  const content = fs.readFileSync(hostsFilePath);
  const result = reExpression.exec(content);
  const {error, data: hosts} = await download();
  if(error){
    console.error(error.stack);
    return;
  }
  if(result===null){
    fs.writeFileSync(hostsFilePath, hosts, {flag: 'a'});
  }else{
    const newContent = content.toString().replace(result[0], hosts);
    fs.writeFileSync(hostsFilePath, newContent);
  }
}

if(require.main.filename == __filename){
  main();
}
