const parameters = require('../config/parameters.json');

function isInWhiteList(urlArray) {
  if(!parameters.tracker || !parameters.tracker.whitelist) {
    return true;
  }

  if(parameters.tracker.whitelist) {
    for (const i in urlArray) {
      if (parameters.tracker.whitelist.indexOf(extractDomain(urlArray[i])) !== -1) {
        return true;
      }
    }
  }

  return false;
}

function isInBlackList(urlArray) {
  if(!parameters.tracker || !parameters.tracker.blacklist) {
    return false;
  }

  if(parameters.tracker.blacklist) {
    for (const i in urlArray) {
      if (parameters.tracker.blacklist.indexOf(extractDomain(urlArray[i])) !== -1) {
        return true;
      }
    }
  }

  return false;
}

function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function extractDomain(url) {
  let domain = extractHostname(url);
  const splitArr = domain.split('.'),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = `${splitArr[arrLen - 2]  }.${  splitArr[arrLen - 1]}`;
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
      //this is using a ccTLD
      domain = `${splitArr[arrLen - 3]  }.${  domain}`;
    }
  }
  return domain;
}

module.exports = {
  isInBlackList,
  isInWhiteList,
};