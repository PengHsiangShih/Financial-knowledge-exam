let round_1 = 0;
let game_alive = false;
let check_queston = false;
let check_round = 0;
let total_questions_array = [];
let questions_array = [];
let question_array = [];
let answers_array = [];
let question_proposition_array = [[7,2,1],[3,1,1]];
let prior_questions_array =[];
//Message object
let round_message = document.getElementById('round_1');
let question_message = document.getElementById('question_1');
let options_message = document.getElementsByClassName("answer_1");
//Button object
let import_btn = document.getElementById("import_quiz");
let sampling_btn = document.getElementById("sampling_quiz");
let extended_sampling_btn = document.getElementById("extended_sampling_quiz");
let next_quiz_btn = document.getElementById("next_quiz");
let show_answer_btn = document.getElementById("show_answer");
let restart_btn = document.getElementById("restart_quiz");
let prior_quiz_btn = document.getElementById("prior_quiz");


//Import button
import_btn.addEventListener('click',function(){
    revealParse();
    round_message.innerText = '總題庫已經匯入，共'+total_questions_array.length+'題';
    console.log(total_questions_array);
}
)

//Sampling and extendend button
sampling_btn.addEventListener('click',function(){
    sampling_func(0)
});

extended_sampling_btn.addEventListener('click',function(){
    sampling_func(1)
});

//Restart button
restart_btn.addEventListener('click',function(){
if(game_alive === true){
    questions_array = [];
    game_alive = false;
    round_message.innerText = '題目已被清空，請重新抽出題目';
    question_message.innerText = ''
    for(let i = 0; i < 4; i++){
        document.getElementsByClassName("answer_1")[i].innerText = ''
    }
    round_1 = 0;
    check_queston = false;
    check_round = 0;
    prior_questions_array = [];
    console.log(prior_questions_array);
}else{
    round_message.innerText = '尚未匯入題目，無法重新開始';
}
}
)

//Next question button
next_quiz_btn.addEventListener('click',function(){
    if(game_alive === true && check_queston === false){
        round_1 = round_1 + 1;
        check_round = round_1;
        if(round_1 <= questions_array.length){
        round_message.innerText = '第'+round_1+'題';
        question_array = questions_array[round_1-1];
        question_array = shuffle_answer(question_array);
        question_answer_func(question_array);
        }else{
            game_alive = false;
            round_message.innerText = '這一輪競賽已經結束，請重新抽出題目';
            question_message.innerText = '';
            for(let i = 0; i < 4; i++){
                document.getElementsByClassName("answer_1")[i].innerText = ''
            }
        }
        prior_questions_array.push(question_array);
        console.log(question_array);
    }else if(game_alive === true && check_queston === true){
        check_round = check_round + 1;
        round_message.innerText = '回顧第' + check_round +'題'
        question_answer_func(prior_questions_array[check_round-1]);
        if(check_round === round_1){
            check_queston = false;
        }
    }else{
        round_message.innerText = '題目尚未匯入或競賽結束，沒有下一題'
    }
})

//Show answer button
show_answer_btn.addEventListener('click',function(){
    if(check_queston === false){
    mark_answer_func(question_array);
    }else if(check_queston === true){
    mark_answer_func(prior_questions_array[check_round-1]);
}
})

//Prior question button
prior_quiz_btn.addEventListener('click',function(){
    if(game_alive === true && round_1 > 1){
        if(check_round > 0){
            check_round = check_round - 1
            round_message.innerText = '回顧第' + check_round +'題'
            question_answer_func(prior_questions_array[check_round-1]);
            check_queston = true;
            }      
    }else{
        round_message.innerText = '競賽尚未開始'
    }
})

//Input event csv file
async function revealParse() {
    total_questions_array = await parseFile()
}

function parseFile() {
    return new Promise(function (resolve) {
        Papa.parse(document.getElementById('csvFile').files[0], {
            download: true,
            header: false,
            skipEmptyLines: true,
            complete: function (results) {
                resolve(results.data)
                //console.log((results.data))
            }
        }
        )
    }
    )
}

//Shuffle array function
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

//Answer shuffled function
function shuffle_answer(question_entered) {
let question_output = [];
let correct_answer = question_entered[parseInt(question_entered[2])+2];
let answer_shuffle = shuffle(question_entered.splice(3, 4));
let correct_answer_number = answer_shuffle.indexOf(correct_answer)+1;
//Push question and correct answer number to output array
question_output.push(question_entered[1]);
question_output.push(correct_answer_number);
//Push shuffled answer to output array
question_output = question_output.concat(answer_shuffle);
console.log('正確答案',correct_answer);
console.log('洗牌後的答案',question_output);
return question_output;
}

//Sampling function
function sampling_func(question_mode){
if (game_alive === false){
    total_questions_array = shuffle(total_questions_array);
    round_1 = 0;
    questions_array = [];
    prior_questions_array = [];
    for(let i=0;i<(question_proposition_array[question_mode].length);i++)  {
        let question_volume = question_proposition_array[question_mode][i];
        console.log(question_volume);
        let samplig_questions = [];
        for(let k=0;k<total_questions_array.length;k++){        
            if (parseInt(total_questions_array[k][0]) === (i+1) && parseInt(total_questions_array[k].length) === 7){
                samplig_questions.push(total_questions_array[k]) 
            }
            if (samplig_questions.length === question_volume) break;       
        }
        questions_array = shuffle(questions_array.concat(samplig_questions));
     } 
     console.log('選出的題目',questions_array);
     round_message.innerText = '競賽開始，總共'+questions_array.length+'題'
     game_alive = true;
     check_queston = false;
    }else{
        round_message.innerText = '競賽正在進行，沒有重新抽出題目，總共'+questions_array.length+'題' ;
    }   
}

//Show question and answer function
function question_answer_func(question_answer){
    question_message.innerText = '題目： ' + question_answer[0];
    for(let i = 2; i < question_answer.length; i++){
        document.getElementsByClassName("answer_1")[i-2].innerText = `${i - 1} ${question_answer[i]}`;
        document.getElementsByClassName("answer_1")[i-2].style.color = "black";};
}

//Mark answer function
function mark_answer_func(question_answer){
    if(game_alive == true){
        document.getElementsByClassName("answer_1")[question_answer[1]-1].style.color = "red";
        console.log(question_answer[1]-1);
    }else{
        round_message.innerText = '沒有題目，無法顯示答案'  
    }
}
