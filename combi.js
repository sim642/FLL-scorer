function genCombinations(n, k, cb) {
    if (n == 0 || k == 0 || n <  k)
        cb([]);
    else {
        for (var l = n - 1; l >= 0; l--) {
            genCombinations(l, k - 1, function(combination) {
                combination.push(l);
                if (combination.length == k)
                    cb(combination);
            });
        }
    }
}

function genPartitions(n, k, cb) {
    genCombinations(n + k - 1, k - 1, function(combination) {
        var partition = [];
        for (var j = 0; j < k; j++) {
            var block = [];
            var begin = j == 0 ? 0 : combination[j - 1] + 1;
            var end = j == k - 1 ? n + k - 1 : combination[j];
            for (var i = begin; i < end; i++)
                block.push(i - j);
            partition.push(block);
        }
        cb(partition);
    });
}
