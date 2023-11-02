const IP = "127.0.0.1"
export const Domain = "data-dictionary.test" // '.net' for aws cloud product; '.link' for aws cloud test; '.test' for local test

export const URL_API = `http://api.${Domain}`;   // "127.0.0.1:1323"
export const URL_SIGN = `http://${Domain}`;      // "127.0.0.1:8080"
export const URL_VIEW = `http://view.${Domain}`; // "127.0.0.1:8081"
export const URL_CMS = `http://cms.${Domain}`;   // "127.0.0.1:8082"


// *** example for nginx/sites config for local running with domain ***
//

// server {
//     server_name api.data-dictionary.test;
//     location / {
//             proxy_pass http://localhost:1323;
//     }
// }

// server {
//     server_name data-dictionary.test;
//     location / {
//             proxy_pass http://localhost:8080;
//     }
// }

// server {
//     server_name view.data-dictionary.test;
//     location / {
//             proxy_pass http://localhost:8081;
//     }
// }

// server {
//     server_name cms.data-dictionary.test;
//     location / {
//             proxy_pass http://localhost:8082;
//     }
// }

////////