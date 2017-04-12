let cheerio = require('cheerio');

function loadLink(url){
	return fetch(url,{mode:'cors'})
		.then((response)=>{console.log(response)});
}

export default loadLink;