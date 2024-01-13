let headersJson = {"Accept":"application/json", "Content-Type":"application/json"};

export default {
    
    get: (url) => {
      return fetch(url).then(res => {
        if(!res.ok){
          throw new Error('Error in get request');
        }
        return res.json();
      });
    },

    post: (url, postBody) => {
      return fetch(url, {method: "POST", headers: headersJson, body:JSON.stringify(postBody)}).then(res => {
        if(!res.ok){
          console.log("Error status: " + JSON.stringify(res.status));
          console.log("Response body: " + JSON.stringify(res.body));
          throw new Error(JSON.stringify(res.statusText));
        }
        console.log("Response: " + JSON.stringify(res));
        return res.json();
      });
    },

    put: (url, putBody) => {
      return fetch(url, {method: "PUT", headers: headersJson, body:JSON.stringify(putBody)}).then(res => {
        if(!res.ok){
          throw new Error('Error in put request');
        }
        return res.json();
      });
    }

}