

 export interface env{
 MY_BUCKET: any;
 AUTH_KEY_SECRET: string | null;
 //MY_BUCKET : R2Bucket;

 }
 const ALLOW_LIST = ['worker.txt'];

const hasValidHeader = (request: Request, env: env): boolean => {
	return request.headers.get('X-Custom-Auth-Keyler') === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request: Request, env: env, key: string) {
	switch (request.method) {
		case 'GET':
			return ALLOW_LIST.includes(key);
		default:
			return false;
	}
}
 export default {
	async fetch(
		request : Request, 
		env : env,
		 ctx : any
		  ): Promise<Response> {


        const url = new URL(request.url);

		const key = url.pathname.slice(1);

switch(request.method) {
case 'GET':
	const object =await env.MY_BUCKET.get(key);

	if(object === null){
return new Response(`Object ${key} doesnot exist`,{
	status:404
});

	}
const headers = new Headers();
object.writeHttpMetadata(headers);
headers.set('e-tag',object.httpEtag);

return new Response(object.body,{
status:200,
headers
});

default:
	return new Response('Method Not Allowed', {
	  status: 405,
	  headers: {
		Allow: ' GET',
	  },
	});
}


		return new Response('Hello World!');
	},
};