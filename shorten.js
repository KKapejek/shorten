const natural = require('natural');
natural.PorterStemmer.attach();
var sentenceSplitter = new natural.SentenceTokenizer();
//------------------

function shorten(input, range){
    //split into individual sentences
    var inputSentences = sentenceSplitter.tokenize(input);
    //------------------

    //split sentences into words and stem them
    //count occurances of each word
    var stemmedSentences = [{
        originalSentence: "", 
        stemmedSentence: "",
        weight: 0,
    }];

    var wordOccurances = {
        word: [],
        occurance: [],
    };

    for(var i = 0; i < inputSentences.length; i++){
        var stemmedSentence = inputSentences[i].tokenizeAndStem();
        stemmedSentences.push({
            originalSentence: inputSentences[i], 
            stemmedSentence: stemmedSentence
        });

        for(var j = 0; j < stemmedSentence.length; j++){
            var position = wordOccurances.word.indexOf(stemmedSentence[j])

            if(position != -1){
                wordOccurances.occurance[position] += 1;
            }
            else {
                wordOccurances.word.push(stemmedSentence[j]);
                wordOccurances.occurance.push(1);
            }
        }
    }
    stemmedSentences.shift();
    //------------------

    //find the most common word and set weight for each word based on it
    var occurances = [...wordOccurances.occurance];
    var mostCommon = occurances.sort((a,b)=>b-a)[0];

    var weightArray = [{
        word: "",
        weight: 0,
    }]

    for(var i = 0; i < wordOccurances.word.length; i++){
        weightArray.push({
            word: wordOccurances.word[i],
            weight: wordOccurances.occurance[i] / mostCommon,
        })
    }
    weightArray.shift();
    //------------------

    //measure weight of all sentences
    for(var i = 0; i < stemmedSentences.length; i++){
        var sentence = stemmedSentences[i].stemmedSentence;
        var weight = 0;

        for(var j = 0; j < sentence.length; j++){
            var word = sentence[j];

            for(var k = 0; k < weightArray.length; k++){
                if(weightArray[k].word == word){
                    weight += weightArray[k].weight;
                    break;
                }
            }
        }

        stemmedSentences[i].weight = weight;
    }
    //------------------

    //get sentence order by weight
    var sortedSentences = [...stemmedSentences];
    sortedSentences.sort((a, b) => b.weight - a.weight)

    var indexArray = [];
    for(var i = 0; i < sortedSentences.length; i++){
        var index = stemmedSentences.indexOf(sortedSentences[i])
        indexArray.push(index);
    }
    indexArray = indexArray.slice(0, range)
    indexArray.sort();
    //------------------

    //prepare the outcome
    var output = "";

    for(var i = 0; i < indexArray.length; i++){
        output += stemmedSentences[indexArray[i]].originalSentence + "\n";
    }

    var statDecreaseRatio = output.slice().length / input.slice().length * 100;
    var statReducedBy = 100 - statDecreaseRatio;
    statReducedBy = statReducedBy.toFixed(2);

    var topWords = weightArray.sort((a, b) => b.weight - a.weight).slice(0,5);
    var statTopWords = [];
    for(var i = 0; i < topWords.length; i++){
        statTopWords.push(topWords[i].word)
    };
    //------------------

    //return the outcome of the algorythm
    out = {
        summary: output,
        statReducedBy: statReducedBy,
        statTopWords: statTopWords
    };
    
    return out;
}

module.exports = shorten;