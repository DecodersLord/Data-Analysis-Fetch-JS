let assignmentId = '';
let buzzwords = [];
let mostUsedWord = '';
let url = `https://one00x-data-analysis.onrender.com/assignment?email=priyank.sevak1996@gmail.com`;
let retries = 50;

function getMostUsedBuzzWord(buzzwords){
    let compare = "";
    let mostFreq = "";
    
    buzzwords.reduce((acc, val) => {
        if(val in acc){             
            acc[val]++;               
        }else{
            acc[val] = 1;     
        }
        if(acc[val] > compare){   
                                
            compare = acc[val];    
            mostFreq = val;       
        }
        return acc;
    }, {})
    console.log(mostFreq);
    return mostFreq;
}
async function getData(url,retries){
    let id = '';

    await fetch(url)
    .then(res => {
        if(res.ok){
            console.log(res.headers.get('x-assignment-id'));
            assignmentId = res.headers.get('x-assignment-id');
            return res.json();
        }
        if(retries > 0){
            return getData(url,retries - 1);
        }
        
    })
    .then(data => {
        buzzwords = data;
        mostUsedWord = getMostUsedBuzzWord(buzzwords);
        console.log(mostUsedWord);
    })
    .catch(error => {
        console.log(error);
        getData();
    })
}

async function sendData(){
    let bodyValue = {
        email : 'priyank.sevak1996@gmail.com',
        answer: mostUsedWord,
        assignment_id: assignmentId
    }
    await fetch(`https://one00x-data-analysis.onrender.com/assignment`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'

        },
        body: JSON.stringify(bodyValue)
    })
    .then(res => {
        if(res.ok){
            return res.json();
        }
        else{
            throw new Error('Submission failed');
        }
    })
    .then(data => {
        console.log(data);
    })
}

async function main(){
    await getData(url,retries);
    sendData();
}
main();