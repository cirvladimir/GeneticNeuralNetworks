// This file contains a neural network with functionality to compute output given a network, generate
// a random neural network, mutate it a little

// __________████████_____██████
// _________█░░░░░░░░██_██░░░░░░█
// ________█░░░░░░░░░░░█░░░░░░░░░█
// _______█░░░░░░░███░░░█░░░░░░░░░█
// _______█░░░░███░░░███░█░░░████░█
// ______█░░░██░░░░░░░░███░██░░░░██
// _____█░░░░░░░░░░░░░░░░░█░░░░░░░░███
// ____█░░░░░░░░░░░░░██████░░░░░████░░█
// ____█░░░░░░░░░█████░░░████░░██░░██░░█
// ___██░░░░░░░███░░░░░░░░░░█░░░░░░░░███
// __█░░░░░░░░░░░░░░█████████░░█████████
// █░░░░░░░░░░█████_████████_█████_█
// █░░░░░░░░░░█___█_████___███_█_█
// █░░░░░░░░░░░░█_████_████__██_██████
// ░░░░░░░░░░░░░█████████░░░████████░░░█
// ░░░░░░░░░░░░░░░░█░░░░░█░░░░░░░░░░░░█
// ░░░░░░░░░░░░░░░░░░░░██░░░░█░░░░░░██
// ░░░░░░░░░░░░░░░░░░██░░░░░░░███████
// ░░░░░░░░░░░░░░░░██░░░░░░░░░░█░░░░░█
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
// ░░░░░░░░░░░█████████░░░░░░░░░░░░░░██
// ░░░░░░░░░░█▒▒▒▒▒▒▒▒███████████████▒▒█
// ░░░░░░░░░█▒▒███████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
// ░░░░░░░░░█▒▒▒▒▒▒▒▒▒█████████████████
// ░░░░░░░░░░████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
// ░░░░░░░░░░░░░░░░░░██████████████████
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
// ██░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ▓██░░░░░░░░░░░░░░░░░░░░░░░░██
// ▓▓▓███░░░░░░░░░░░░░░░░░░░░█
// ▓▓▓▓▓▓███░░░░░░░░░░░░░░░██
// ▓▓▓▓▓▓▓▓▓███████████████▓▓█
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█

var generateNetwork = function (nLayers, nInput, nOutput) {
    var nn = { neurons: [], input: [], output: [], layers: [] };
    var genNeuron = function() {
        return { bias: Math.random() * 2 - 1, connections: [], value: 0 };
    };
    var front = Array.range(nInput).map(function() {
        return genNeuron();
    });
    nn.input = front;
    nn.neurons = nn.neurons.concat(front);

    var distinctRandom = function (n, max) {
        var used = Array.range(max);
        var nums = [];
        while (n > 0) {
            var r = Math.floor(Math.random() * max);
            while (used[r])
                r = Math.floor(Math.random() * max);
            nums.push(r);
            n--;
        }
        return nums;
    };

    Array.range(nLayers).forEach(function () {
        var newFront = [];
        var used = Array.range(front.length);
        while (!used.every(_)) {
            var newNeuron = genNeuron();
            newFront.push(newNeuron);
            nn.neurons.push(newNeuron);
            $(distinctRandom, Math.random() * front.length / 4 * 3 + front.length / 8, front.length).forEach(function (ind) {
                newNeuron.connections.push({weight: Math.random(), neuron: front[ind]});
                used[ind] = true;
            });
        }
        nn.layers.push(newFront.map(_));
        $(distinctRandom, Math.random() * front.length / 3, front.length).forEach(function (ind) {
            newFront.push(front[ind]);
        });
        front = newFront;
    });
    nn.output = Array.range(nOutput).map(function () {
        return genNeuron();
    });
    nn.layers.push(nn.output);
    nn.neurons = nn.neurons.concat(nn.output);
    front.forEach(function (el, ind) {
        Array.range(Math.max(1, Math.floor(nOutput / 4))).forEach(function () {
            var randOut = Math.floor(Math.random() * nOutput);
            while (nn.output[randOut].connections.some($(ФEq, el)))
                randOut = Math.floor(Math.random() * nOutput);
            nn.output[randOut].connections.push({weight: Math.random(), neuron: el});
        });
    });
    nn.output.forEach(function (el, ind) {
        Array.range(Math.max(1, Math.floor(front.length / 4))).forEach(function () {
            var randIn = Math.floor(Math.random() * front.length);
            while (el.connections.some($(ФEq, front[randIn])))
                randIn = Math.floor(Math.random() * front.length);
            el.connections.push({weight: Math.random(), neuron: front[randIn]});
        });
    });
    return nn;
};

var σ = function(z) {
    return 1 / (1 + Math.exp(-z));
};

var runNetwork = function (nn, input) {
    input.forEach(function (v, i) {
        nn.input[i].value = v;
    });
    nn.layers.forEach(function (layer) {
        layer.forEach(function (neuron) {
            neuron.value = σ(neuron.connections.reduce(function (acc, con) {
                return acc + con.weight * con.neuron.value;
            }, neuron.bias));
        });
    });
    return nn.output.map(function(neuron) { return neuron.value; });
};

